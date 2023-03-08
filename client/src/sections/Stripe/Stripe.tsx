import React, { useEffect, useRef } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Layout, Spin } from "antd";

import { Viewer } from "../../lib/gql/graphql";
import { CONNECT_STRIPE } from "../../lib/graphql/mutations/ConnectStripe";
import { displaySuccessNotification } from "../../lib/utils/utils";

const { Content } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const Stripe = ({ viewer, setViewer }: Props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [connectStripe, { data, loading, error }] = useMutation(
    CONNECT_STRIPE,
    {
      onCompleted: (data) => {
        if (data && data.connectStripe) {
          setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet });
          displaySuccessNotification(
            "You've successfully connected your Stripe Account!",
            "You can now begin to create listings in the Host page."
          );
        }
      },
    }
  );

  const connectStripeRef = useRef(connectStripe);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) return navigate(`/login`, { replace: true });

    connectStripeRef.current({
      variables: {
        input: { code },
      },
    });
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <Content className="stripe">
        <Spin size="large" tip="Connecting your Stripe account..." />
      </Content>
    );
  }

  if (error) {
    return <Navigate to={`/user/${viewer.id}?stripe_error=true`} />;
  }

  if (data && data.connectStripe) {
    return <Navigate to={`/user/${viewer.id}`} />;
  }

  return null;
};

export default Stripe;
