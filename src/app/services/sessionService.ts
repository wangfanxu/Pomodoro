import { Configuration } from "../entities/Configuration";
import { Cycle } from "../entities/Cycle";
import { Session } from "../entities/Session";
import { User } from "../entities/User";
import {
  createCycle,
  getUserUncompletedCycles,
  updateCycle,
} from "../repositories/cycleRepository";
import {
  createSessionBySessionType,
  getSessionsByCycle,
} from "../repositories/sessionRepository";
import { getUserWithConfiguration } from "../repositories/userRepository";
import { CreateSession } from "../schema/Session";
import { scheduleCountdownJob, sendNotification } from "../utils/scheduler";

const defaultConfiguration = {
  workInterval: 4,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
} as Configuration;

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
  console.log("retrieved cycle");
  if (!cycle) {
    cycle = await createCycle(user);
    console.log("created cycle");
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

// function getSessionDuration(
//   sessionType: "work" | "short_break" | "long_break",
//   configuration: Configuration
// ) {
//   switch (sessionType) {
//     case "work":
//       return configuration.workInterval;
//     case "short_break":
//       return configuration.shortBreak;
//     case "long_break":
//       return configuration.longBreak;
//   }
// }
