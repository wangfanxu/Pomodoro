import cron, { ScheduledTask } from "node-cron";
// import notifier from "node-notifier";
import { Session } from "../entities/Session";
import { getSession, updateSession } from "../repositories/sessionRepository";
import { userSockets } from "../websocket";
import { User } from "../entities/User";
import { Cycle } from "../entities/Cycle";
import { startNextSession } from "../services/sessionService";

type JobManager = {
  [sessionId: number]: ScheduledTask;
};

const jobManager: JobManager = {};
export const scheduleCountdownJob = (
  user: User,
  cycle: Cycle,
  session: Session
) => {
  console.log("start schedule countdown job for ", session.id);
  // Calculate the cron expression for the job (runs once after the session's duration)
  const endTime = session.endTime;
  if (!endTime) throw Error("end time not declared");
  const cronTime = `${endTime.getSeconds()} ${endTime.getMinutes()} ${endTime.getHours()} ${endTime.getDate()} ${
    endTime.getMonth() + 1
  } *`;

  // Schedule the job
  const job = cron.schedule(cronTime, async () => {
    console.log("start job execute");
    await updateSession(session.id, {
      status: "completed",
    });
    startNextSession(user, cycle, session);
    sendNotification(session.user.id, `${session.user.id} times up!`);
    // Send notification to user
    delete jobManager[session.id];
  });

  // Store the job in the job manager
  jobManager[session.id] = job;
};

// Function to stop a job
export const stopJob = async (sessionId: number) => {
  const job = jobManager[sessionId];
  if (job) {
    job.stop();
    await updateSession(sessionId, {
      status: "paused",
    });
  } else {
    throw new Error(`No job found for session ID ${sessionId}`);
  }
};

// Function to resume a job
// export async function resumeJob(sessionId: number) {
//   const session = await getSession(sessionId);
//   if (!session) {
//     throw new Error(`Session with ID ${sessionId} not found`);
//   }

//   if (!session.endTime) {
//     throw Error(`end time is not defined with ID ${sessionId}`);
//   }

//   const remainingDuration =
//     (session.endTime.getTime() - new Date().getTime()) / 1000;
//   if (remainingDuration > 0) {
//     scheduleCountdownJob({ ...session, duration: remainingDuration });
//   } else {
//     throw new Error("Session has already ended or has negative remaining time");
//   }
// }

export function sendNotification(userId: number, message: string) {
  const ws = userSockets.get(userId);

  if (!ws) {
    console.warn("no websocket established, skip for userId", userId);
  }
  if (ws) {
    ws.send(message);
  }
}

// Function to send notification to user
// function sendNotification(user: User, session: Session) {
//   notifier.notify({
//     title: "Pomodoro Timer",
//     message: `Your session has ended. Time to take a break!`,
//   });
// }

// // Usage example
// createNewSession(1, 25 * 60) // 25 minutes
//   .then((session) => {
//     console.log("New session created:", session);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// // Example stopping and resuming a job
// setTimeout(() => {
//   stopJob(1); // Stop job with session ID 1
//   setTimeout(() => {
//     resumeJob(1); // Resume job with session ID 1 after 10 seconds
//   }, 10000);
// }, 10000);
