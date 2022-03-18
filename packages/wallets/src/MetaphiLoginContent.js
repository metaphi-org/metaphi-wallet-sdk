import { useState } from "react";
import axios from "axios";
import Cookies from "cookies-js";
// utils
import MetaphiConfig from "./Metaphi";

const METAPHI_LOGIN_STATES = {
  EMAIL: "email",
  VERIFICATION_CODE: "verification_code",
};

const EmailContent = ({ onClickCallback }) => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col max-w-md text-left">
      <div>
        <div className="text-left text-white text-lg">
          Please enter your Email ID
        </div>
      </div>
      <input
        type="email"
        placeholder="Email ID"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        style={{ backgroundColor: "#EBEBEB", borderRadius: "6px" }}
        className="block border-2 border-gray-200 my-4 w-full px-4 py-2 text-black"
      ></input>
      <div className="flex flex-row mt-12 justify-between">
        <div>
          <div className="text-sm"></div>
          <div className="text-pink cursor-pointer"></div>
        </div>
        <div
          className="bg-pink cursor-pointer text-center w-[130px] h-[40px] p-2 rounded-full"
          onClick={() => onClickCallback(email)}
        >
          Next
        </div>
      </div>
    </div>
  );
};

const VerificationCodeContent = ({ email, onClickCallback }) => {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col max-w-md text-left">
      <div>
        <div className="text-left text-white text-lg">
          Please enter the verification code
        </div>
        <div className="text-sm mt-1">
          Enter the 6-digit verfication code received on your email:{" "}
          <span className="text-pink">{email}</span>
        </div>
      </div>
      <input
        type="text"
        placeholder="Enter Code"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        style={{ backgroundColor: "#EBEBEB", borderRadius: "6px" }}
        className="block border-2 border-gray-200 my-4 w-full px-4 py-2 text-black"
      ></input>
      <div className="flex flex-row mt-10 justify-between">
        <div>
          <div className="text-sm">Did not receive code?</div>
          <div className="text-pink">Resend Code</div>
        </div>
        <div
          className="bg-pink cursor-pointer text-center w-[130px] h-[40px] p-2 rounded-full"
          onClick={() => onClickCallback(email, value)}
        >
          Submit
        </div>
      </div>
    </div>
  );
};

const MetaphiLoginContent = ({ email: initEmail, onConnect }) => {
  const [email, setEmail] = useState(initEmail);
  const [ui, setUi] = useState(METAPHI_LOGIN_STATES.EMAIL);

  const onClickEmail = async (email) => {
    const { api_key, account_id } = MetaphiConfig.getConfig();
    console.log("metaphi- connecting email", { email, account_id, api_key });
    const payload = {
      url: "https://api.metaphi.xyz/v1/wallets",
      headers: {
        "x-metaphi-api-key": api_key,
        "x-metaphi-account-id": account_id,
      },
      method: "POST",
      data: { email },
    };
    await axios(payload);
    setEmail(email);
    setUi(METAPHI_LOGIN_STATES.VERIFICATION_CODE);
  };

  const onClickVerify = async (email, verificationCode) => {
    const { api_key, account_id } = MetaphiConfig.getConfig();
    console.log("metaphi- verify email", {
      email,
      account_id,
      api_key,
      verificationCode,
    });
    const payload = {
      // url: proxyUri,
      url: "https://api.metaphi.xyz/v1/wallets/verify", //proxyUri,
      headers: {
        "x-metaphi-api-key": api_key,
        "x-metaphi-account-id": account_id,
      },
      method: "POST",
      data: {
        email,
        verification_code: parseInt(verificationCode),
      },
    };
    const response = await axios(payload);
    // save jwt
    const jwtToken = response.data;
    Cookies.set("x-metaphi-auth", jwtToken);
    onConnect(jwtToken);
  };

  let content;
  switch (ui) {
    case METAPHI_LOGIN_STATES.EMAIL:
      content = <EmailContent onClickCallback={onClickEmail} />;
      break;
    case METAPHI_LOGIN_STATES.VERIFICATION_CODE:
      content = (
        <VerificationCodeContent
          email={email}
          onClickCallback={onClickVerify}
        />
      );
      break;
    default:
      break;
  }

  return (
    <div>
      <div className="pt-20 pb-6 w-[403px]">{content}</div>
    </div>
  );
};

export { MetaphiLoginContent };
