// // src/scheduler.ts
// import cron from "node-cron";
// import { getRepository } from "typeorm";
// import { Session } from "./entity/Session";

// const WORK_INTERVAL = 25 * 60 * 1000; // 25 minutes

// cron.schedule("* * * * *", async () => {
//   console.log("Running scheduled job to check expired timers");

//   const sessionRepository = getRepository(Session);

//   const now = new Date();
//   const activeSessions = await sessionRepository.find({
//     where: {
//       end_time: null,
//       status: "active",
//       start_time: LessThan(now),
//     },
//   });

//   for (const session of activeSessions) {
//     const sessionStartTime = new Date(session.start_time);
//     const elapsed = now.getTime() - sessionStartTime.getTime();

//     if (elapsed >= WORK_INTERVAL) {
//       session.end_time = now;
//       session.status = "completed";
//       await sessionRepository.save(session);
//     }

//     const userSocket = userSockets.get(session.user_id);

//     if (userSocket) {
//       userSocket.send(
//         JSON.stringify({
//           type: "notification",
//           message: "Your timer has ended!",
//         })
//       );
//     }

//     // Notify client about session end
//     // Here, you would typically use WebSocket or another method to send a notification
//   }
// });
