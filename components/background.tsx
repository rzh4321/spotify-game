"use client";

import { useEffect } from "react";

export default function Background({ hideOverflow  } : {hideOverflow: boolean}) {
  useEffect(() => {
    if (hideOverflow) {

      document.body.classList.add('overflow-y-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-y-hidden');
    }
  }, [hideOverflow])
  return (
    <div className="ripple-background z-[0]">
      <div className="circle xxlarge shade1"></div>
      <div className="circle xlarge shade2"></div>
      <div className="circle large shade3"></div>
      <div className="circle mediun shade4"></div>
      <div className="circle small shade5"></div>

      <div className="top-right-circle xxlarge shade1"></div>
      <div className="top-right-circle xlarge shade2"></div>
      <div className="top-right-circle large shade3"></div>
      <div className="top-right-circle medium shade4"></div>
      <div className="top-right-circle small shade5"></div>
    </div>
  );
}
