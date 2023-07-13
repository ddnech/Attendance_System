import React from "react";

export default function Header(children) {
  return (
    <div className="flex justify-between px-4 pt-4">
       <img src={"https://d1csarkz8obe9u.cloudfront.net/posterpreviews/business-logo-design-template-78655edda18bc1196ab28760f1535baa_screen.jpg?ts=1617645324"} alt="Logo" className="w-16 h-16 " />
      <h2 className="pt-4 font-bold font-roboto">Admin</h2>
    </div>
  );
}
