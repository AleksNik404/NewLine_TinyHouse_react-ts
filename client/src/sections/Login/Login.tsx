import { useApolloClient, useMutation } from "@apollo/client";
import { Card, Layout, Spin, Typography } from "antd";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ErrorBanner } from "../../lib/components";
import { Viewer } from "../../lib/gql/graphql";
import { LOG_IN } from "../../lib/graphql/mutations/Login";
import { AUTH_URL } from "../../lib/graphql/queries/Auth";
import {
  displayErrorMessage,
  displaySuccessNotification,
} from "../../lib/utils/utils";
import googleLogo from "./assets/google_logo.jpg";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();

  const [logIn, { data: logInData, loading: logInLoading, error: logInError }] =
    useMutation(LOG_IN, {
      onCompleted: (data) => {
        if (data && data.logIn && data.logIn.token) {
          setViewer(data.logIn);
          sessionStorage.setItem("token", data.logIn.token);
          displaySuccessNotification("You`ve successfully logged in!");
        }
      },
    });

  const logInRef = React.useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query({
        query: AUTH_URL,
      });

      window.location.href = data.authUrl;
    } catch (error) {
      displayErrorMessage(
        "Sorry! we weren`t able to log you in. Please try again later!"
      );
    }
  };

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Navigate to={`/user/${viewerId}`} />;
  }

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..."></Spin>
      </Content>
    );
  }

  return (
    <Content className="log-in">
      {logInError && (
        <ErrorBanner description="Sorry! We weren`t able to log you in. Please try again later!" />
      )}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorize}
        >
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
};

export default Login;
