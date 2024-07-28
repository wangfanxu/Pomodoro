import { Configuration } from "../entities/Configuration";
import { Cycle } from "../entities/Cycle";
import { Session } from "../entities/Session";
import { User } from "../entities/User";
import {
  createCycle,
  getCycleById,
  getUserUncompletedCycles,
  updateCycle,
} from "../repositories/cycleRepository";
import {
  createSessionBySessionType,
  getSessionById,
  getSessionsByCycle,
  updateSession,
} from "../repositories/sessionRepository";
import { getUserWithConfiguration } from "../repositories/userRepository";
import { CreateSession } from "../schema/sessionSchema";
import {
  scheduleCountdownJob,
  sendNotification,
  stopJob,
} from "../utils/scheduler";

const defaultConfiguration = {
  workInterval: 4,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
} as Configuration;

const stopSession = async (
  userId: number,
  _cycleId: number,
  sessionId: number
) => {
  console.log(
    `stopping session for user ${userId},cycleId,${_cycleId} for session ${sessionId}`
  );
  const session = await getSessionById(sessionId);
  console.log("retrieved session", session);
  if (!session) throw Error(`invalid session id ${sessionId}`);

  try {
    await stopJob(sessionId);
  } catch (e) {
    console.error("error catch!");
  }

  console.log("execution finished");
};

const resumeSession = async (
  userId: number,
  cycleId: number,
  sessionId: number
) => {
  const [user, cycle, session] = await Promise.all([
    getUserWithConfiguration(userId),
    getCycleById(cycleId),
    getSessionById(sessionId),
  ]);

  console.log("retrieved cycle", cycle);
  if (
    !session ||
    !session.endTime ||
    !session.stopTime ||
    session.status !== "paused" ||
    !cycle
  ) {
    console.log("error throwing");
    throw Error(
      "unable resume session due to session is possible not stop yet"
    );
  }
  const now = new Date();
  const remainingTime = session.endTime.getTime() - session.stopTime.getTime();
  const newEndingTime = new Date(now.getTime() + remainingTime);

  // Update session end time and status
  session.endTime = newEndingTime;
  session.status = "in_progress";
  session.stopTime = null; // Clear stopTime since session is resumed

  // Save the updated session

  console.log("before update session");
  await updateSession(sessionId, {
    endTime: newEndingTime,
    status: "in_progress",
    stopTime: null,
  });

  // Schedule the countdown job with the new remaining duration
  scheduleCountdownJob(user, cycle, session);
};

const updateSessionHandler = {
  paused: stopSession,
  resume: resumeSession,
};

export const handleUpdateSession = async (
  userId: number,
  cycleId: number,
  sessionId: number,
  status: "resume" | "paused"
) => {
  console.log("handler running");
  return await updateSessionHandler[status](userId, cycleId, sessionId);
};

export const handleCreateSession = async (session: CreateSession) => {
  const user = await getUserWithConfiguration(session.userId);
  console.log("user", user);

  if (!user) {
    console.log("cannot find user");
    throw Error(`unable find user with userId ${session.userId}`);
  }

  if (!user.configuration) {
    //use default configuration
    console.log("setting default configuration", defaultConfiguration);
    user.configuration = defaultConfiguration;
  }

  //create session
  console.log("before create session");

  //check is there any existing cycle

  let cycle = await getUserUncompletedCycles(user.id);
  if (!cycle) {
    cycle = await createCycle(user);
    console.log("create cycle with user", user);
  }
  const createdSession = await createSessionBySessionType(
    user,
    session.sessionType,
    cycle
  );

  //start new job to count down
  scheduleCountdownJob(user, cycle, createdSession);
};

export async function startNextSession(
  user: User,
  cycle: Cycle,
  lastSession: Session
) {
  //do nothing if cycle already completed
  if (cycle.completed) return;
  console.log("cycle", cycle);
  const sessions = await getSessionsByCycle(cycle);

  console.log("retrieved sessions", sessions);

  switch (lastSession.type) {
    case "work":
      const numberOfWorkCompleted = sessions.filter(
        (session) => (session.type = "work")
      ).length;
      console.log("length of works", numberOfWorkCompleted);
      if (numberOfWorkCompleted >= user.configuration.longBreakInterval) {
        const createdSession = await createSessionBySessionType(
          user,
          "longBreak",
          cycle
        );
        scheduleCountdownJob(user, cycle, createdSession);
      } else {
        const createdSession = await createSessionBySessionType(
          user,
          "shortBreak",
          cycle
        );
        scheduleCountdownJob(user, cycle, createdSession);
      }
      break;

    case "shortBreak":
      const createdSession = await createSessionBySessionType(
        user,
        "work",
        cycle
      );
      scheduleCountdownJob(user, cycle, createdSession);
      break;

    case "longBreak":
      await updateCycle(cycle.id, {
        completed: true,
      });
      sendNotification(
        cycle.user.id,
        "your have finished a pomodoro cycle, congratulation!"
      );
      break;
  }
}
