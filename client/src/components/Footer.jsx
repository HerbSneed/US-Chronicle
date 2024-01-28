import facebook from "../assets/images/facebook_icon.webp";
import email from "../assets/images/email-icon.webp";
import insta from "../assets/images/instagram_icon.webp";
import whiteLogo from "../assets/images/US-Chronical-White.png";

function Footer() {
  return (
      <footer
        id="footer-section"
        className="w-full bg-black h-48 flex flex-col items-center z-50"
      >
        <img
          src={whiteLogo}
          className="w-32 overflow-hidden -mt-10 sm:w-10"
          alt="US Chronical Icon"
        />
        <p className="text-white text-xs -mt-8">
          Copyright ©2030 US Chronical Inc. All rights reserved.
        </p>

        <div className="flex flex-row w-2/12 sm:w-2/12 md:w-[110px] lg:w-[110px] xl:w-[110px] 2xl:w-[110px] justify-center mt-6 space-x-3 ">
          <a
            href="https://www.facebook.com/profile.php?id=61550263295423"
            target="_blank"
            rel="noreferrer"
          >
            <img src={facebook} alt="Facebook" className="" />
          </a>

          <a
            href="mailto:pierreneltv@gmail.com"
            target="_blank"
            rel="noreferrer"
          >
            <img src={insta} alt="email icon" />
          </a>

          <a
            href="mailto:pierreneltv@gmail.com"
            target="_blank"
            rel="noreferrer"
          >
            <img src={email} alt="email icon" />
          </a>
        </div>

        <div className="w-full flex flex-row items-center -ml-4 -mt-5 sm:-mt-4 lg:-mt-6 xl:-mt-7 2xl:-mt-9 justify-center">
          <p className="ml-1 mt-6 lg:mt-7 2xl:mt-9  text-base-content font-semibold 2xl:text-xl">
            ©™ A Peggy Joyce&apos;s Boy Production
          </p>
        </div>
      </footer>
  );
}

export default Footer;
