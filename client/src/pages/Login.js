import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { useAuth } from "../contexts/Auth";
import { loginUser, verifyCaptcha } from "../utils/apis/auth";
import { ACCESS_TOKEN_KEY, CAPTCHA_SITE_KEY } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const { setAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCaptchaVerified) {
      const result = await loginUser({
        email,
        password,
      });

      if (result) {
        setAuthenticated(true);
      }

      navigate("/dashboard");
    } else {
      alert("Please complete the CAPTCHA.");
    }
  };

  const handleCaptchaVerify = async (token) => {
    setIsCaptchaVerified(true);
    const result = await verifyCaptcha({ token });

    if (result) {
      setIsCaptchaVerified(true);
    }
  };

  return (
    <>
      <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-100">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            action="#"
            method="POST"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <ReCAPTCHA
              sitekey={CAPTCHA_SITE_KEY}
              onChange={handleCaptchaVerify}
            />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Signup here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
