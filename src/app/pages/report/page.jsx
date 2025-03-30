"use client";
import Image from "next/image";
import BGI from "@/assets/img.jpg";
import ReP1 from "@/assets/report/Repote1.jpg";
import ReP2 from "@/assets/report/Repote2.jpg";
import ReP3 from "@/assets/report/Repote3.jpg";
import MainLayout from "@/components/MainLayout/MainLayout";

const Page = () => {
  return (
    <MainLayout>
      <div className="relative w-full h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={BGI || "/placeholder.svg"}
            alt="Background"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full px-10">
          {/* Top Section */}
          <div className="flex justify-between w-full max-w-[80%] mb-12">
            {/* Order Details */}
            <div className="w-[30%] bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="h-56 relative mb-4">
                  <Image
                    src={ReP1 || "/placeholder.svg"}
                    alt="Order Details"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-center text-2xl font-semibold text-gray-800">
                  Order Details
                </h3>
              </div>
            </div>

            {/* Furniture Report */}
            <div className="w-[30%] bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="h-56 relative mb-4">
                  <Image
                    src={ReP2 || "/placeholder.svg"}
                    alt="Furniture Report"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-center text-2xl font-semibold text-gray-800">
                  Furniture Report
                </h3>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="w-[30%] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="h-56 relative mb-4">
                <Image
                  src={ReP3 || "/placeholder.svg"}
                  alt="Financial Report"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h3 className="text-center text-2xl font-semibold text-gray-800">
                Financial Report
              </h3>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Page;
