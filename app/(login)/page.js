"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/register.module.css";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LoginPage = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { data: session, status } = useSession();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/management/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return null; // Don't show anything while checking or already logged in
  }

  const loginSubmit = async (data) => {
    if (isLoading) return;
    const { username, password } = data;
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setLoginError("Invalid credentials.");
        setTimeout(() => setLoginError(""), 2000);
        return;
      }

      router.replace("/management/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <section className={styles.loginSectionWrapper}>
        
        <div className="row">
          <div className="col-md-6">
            <div className={styles.loginLeftEction}>
              <div className={styles.loginLeft}>
                <div className="d-flex justify-content-center" style={{maxHeight:"100px"}}>
                  <img
                    src="/images/digicaseLogo.png"
                    alt=""
                    className="img-fluid" style={{objectFit:"contain"}}
                  />
                </div>
                <div className={styles.loginToptext}>
                  <h1 className={styles.loginMainheading}>
                    Login to your account
                  </h1>
                  
                </div>
                <div className={styles.registerCenter}>
                  {/* <h2 className={styles.RegisterHead}>
          {currentPage == "login" ? "Login" : "Register"}</h2> */}

                  {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                  {currentPage && currentPage == "login" && (
                    <form
                      className={`${styles.registerFormDetails} form-md`}
                      onSubmit={handleLoginSubmit(loginSubmit)}
                    >
                      <div className="form-group py-2">
                        <label htmlFor="username">
                          <p className={styles.LoginHeading}>Email address</p>
                        </label>

                        <input
                          className={`${styles.forminput} form-control`}
                          placeholder="name@website.com"
                          type="text"
                          {...loginRegister("username", {
                            required: "This field is required.",
                          })}
                        />

                        {loginErrors.email && (
                          <span className="text-warning-custom">
                            {loginErrors.email.message}
                          </span>
                        )}
                      </div>

                      <div
                        className="form-group py-2"
                        style={{ position: "relative" }}
                      >
                        <label htmlFor="password">
                          <p className={styles.LoginHeading}>Password</p>
                        </label>

                        <input
                          id="password"
                          className={`${styles.forminput} form-control`}
                          placeholder="Password"
                          type={showPassword ? "text" : "password"}
                          {...loginRegister("password", {
                            required: "This field is required.",
                          })}
                        />

                        {/* Eye Icon */}
                        <span
                          onClick={togglePasswordVisibility}
                          style={{
                            position: "absolute",
                            top: "70%",
                            right: "15px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "#888",
                          }}
                        >
                          {showPassword ? (
                            <AiOutlineEyeInvisible size={20} />
                          ) : (
                            <AiOutlineEye size={20} />
                          )}
                        </span>

                        {loginErrors.password && (
                          <span className="text-warning-custom">
                            {loginErrors.password.message}
                          </span>
                        )}
                      </div>

                      <div className={styles.LoginRemember}>
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className={`${styles.forminput} custom-control-input`}
                            id="customCheck1"
                          />
                          <label
                            className="custom-control-label px-2"
                            htmlFor="customCheck1"
                          >
                            Keep me logged in
                          </label>
                        </div>
                      </div>

                      <div className={styles.registerButton}>
                        <button
                          type="submit"
                          className={`${styles.registerWrapperButton} mb-3 commonBtn`}
                          disabled={isLoading}
                        >
                          {isLoading ? "Login..." : "Login"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div >
              <img
                src="/images/loginbackground.png"
                alt="Login Background"
                class="img-fluid"
              />
            </div>
          </div>
        </div>
       
      </section>
    </>
  );
};

export default LoginPage;
