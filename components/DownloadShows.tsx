import React from "react";
import Image from "next/image";

type Props = {};

function DownloadShows({}: Props) {
  return (
    <section className="section-dowload text-white border-b-8 border-gray-800 xl:px-28 items-center">
      <div className="container flex">
        <div className="grid">
          <div className="hidden  md:flex flex-col text-info pl-24">
            <h1>Download your shows to watch offline</h1>
            <p>
              Save your favorites easily and always have something to watch.
            </p>
          </div>
          <div className="config-img relative w-full max-w-md">
            <div className="relative w-full h-80 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📱</div>
                <div className="text-lg font-semibold mb-2">Mobile Download</div>
                <div className="text-sm text-gray-400">Feature Demo</div>
              </div>
            </div>
            <div className="cardanimation absolute bottom-4 left-4 right-4 bg-black bg-opacity-80 rounded-lg p-3 flex items-center gap-3">
              <div className="w-12 h-16 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">ST</span>
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold">Stranger Things</h2>
                <p className="text-blue-500 text-sm">Ready to watch</p>
              </div>
              <div className="w-6 h-6 border-2 border-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DownloadShows;
