"use client";

export default function Background() {
  return (
    <div className="fixed w-full h-screen z-[0]">
      <div className="circle xxlarge shade1"></div>
      <div className="circle xlarge shade2"></div>
      <div className="circle large shade3"></div>
      <div className="circle medium shade4"></div>
      <div className="circle small shade5"></div>

      <div className="top-right-circle xxlarge shade1"></div>
      <div className="top-right-circle xlarge shade2"></div>
      <div className="top-right-circle large shade3"></div>
      <div className="top-right-circle medium shade4"></div>
      <div className="top-right-circle small shade5"></div>
    </div>
  );
}
