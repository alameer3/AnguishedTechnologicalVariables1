import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { AiFillMail } from "react-icons/ai";
import { GoGitPullRequest } from "react-icons/go";
import { MdCastForEducation } from "react-icons/md";
import { RiNetflixFill } from "react-icons/ri";
import { firestore } from "../firebase/firebase";

type Props = {};

function AboutFeed({}: Props) {
  const { data: session } = useSession();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (feedback && session) {
      try {
        await addDoc(collection(firestore, "feedBack"), {
          username: session?.user?.name,
          caption: feedback,
          profileImage: session?.user?.image,
          email: session?.user?.email,
          timestamp: serverTimestamp() as Timestamp,
        });

        setFeedback("");
      } catch (error) {
        // Firebase permission error with mock session - handled silently
      }
    }
  };

  return (
    <main className="relative pl-4 pb-24 lg:space-y-24 h-auto">
      <div className="pt-36 pb-18">
        <p className="text-3xl font-semibold px-20">{`Information's`}</p>
        <div className="inline-block md:flex justify-between px-16 py-8 overflow-x-hidden ">
          <div className="w-[280px] md:w-[465px] sm:w-[450px] lg:w-[700px] h-[300px] bg-gray-800 rounded flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-8xl mb-4">🎬</div>
              <div className="text-lg font-semibold">Netflix Clone Demo</div>
              <div className="text-sm text-gray-400 mt-2">Educational Project</div>
            </div>
          </div>
          <div className="items-center space-y-4">
            <p className="flex justify-start items-center gap-4 text-xl font-semibold">
              <RiNetflixFill size={24} /> Netflix Clone
            </p>
            <p className="flex justify-start items-center gap-4 text-lg font-semibold">
              <MdCastForEducation size={24} /> For Educational Purposes Only
            </p>
            <p className="flex justify-start items-center gap-4 text-lg font-semibold">
              <AiFillMail size={24} /> Contact:
              <br />{" "}
              <span className="text-sm text-gray-400">
                sashenjayathilaka95@gmail.com
              </span>
            </p>
            <form
              className="pt-20 flex flex-col items-start"
              onSubmit={handleSubmit}
            >
              <p className="flex justify-start items-center space-x-4 text-lg font-medium gap-4">
                <GoGitPullRequest size={24} /> Feedback
              </p>
              <input
                className="py-6 w-[500px] mt-4 bg-gray-900 placeholder:text-gray-400 rounded-md outline-none px-2.5"
                placeholder="Request Source Code and Feedback"
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button
                disabled={!feedback}
                onClick={handleSubmit}
                type="submit"
                className="bg-gray-800 text-sm px-2.5 py-2.5 font-medium hover:bg-gray-500 text-gray-100 hover:text-gray-900 mt-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:text-gray-500"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AboutFeed;
