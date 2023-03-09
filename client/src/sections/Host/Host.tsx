import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Layout,
  Radio,
  Typography,
  Upload,
} from "antd";
import {
  BankOutlined,
  HomeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";

import {
  displayErrorMessage,
  displaySuccessNotification,
  iconColor,
} from "../../lib/utils/utils";
import { ListingType, Viewer } from "../../lib/gql/graphql";
import { HOST_LISTING } from "../../lib/graphql/mutations/HostListing";

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

interface Props {
  viewer: Viewer;
}

const getRequiredRule = (message: string) => ({
  required: true,
  message,
});

const Host = ({ viewer }: Props) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  const [hostListing, { loading, data }] = useMutation(HOST_LISTING, {
    onCompleted: () => {
      displaySuccessNotification("You've successfully created your listing!");
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to create your listing. Please try again later."
      );
    },
  });

  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      setImageLoading(true);
      return;
    }

    if (
      // Я без понятия почему вылетает с ошибкой
      // file.status === "done" &&
      file.originFileObj
    ) {
      getBase64Value(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  if (data && data.hostListing) {
    return <Navigate to={`/listing/${data.hostListing.id}`} />;
  }

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            You'll have to be signed in and connected with Stripe to host a
            listing!
          </Title>
          <Text type="secondary">
            We only allow users who've signed in to our application and have
            connected with Stripe to host new listings. You can sign in at the{" "}
            <Link to="/login">/login</Link> page and connect with Stripe shortly
            after.
          </Text>
        </div>
      </Content>
    );
  }

  if (loading) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Please wait!
          </Title>
          <Text type="secondary">We're creating your listing now.</Text>
        </div>
      </Content>
    );
  }

  const onFinish = (values: any) => {
    const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode}`;

    const input = {
      ...values,
      address: fullAddress,
      image: imageBase64Value,
      price: values.price * 100,
    };
    delete input.city;
    delete input.state;
    delete input.postalCode;

    hostListing({
      variables: {
        input,
      },
    });
  };

  const onFinishFailed = () => {
    displayErrorMessage("Please complete all required form fields!");
  };

  return (
    <Content className="host-content">
      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Hi! Let's get started listing your place.
          </Title>
          <Text type="secondary">
            In this form, we'll collect some basic and additional information
            about your listing.
          </Text>
        </div>

        <Item
          label="Home Type"
          name="Home Type"
          rules={[getRequiredRule("Please select a home type!")]}
        >
          <Radio.Group>
            <Radio.Button value={ListingType.Apartment}>
              <BankOutlined style={{ color: iconColor }} />{" "}
              <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.House}>
              <HomeOutlined style={{ color: iconColor }} /> <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item
          label="Max # of Guests"
          name="Max # of Guests"
          rules={[getRequiredRule("Please enter the max number of guests!")]}
        >
          <InputNumber min={1} placeholder="4" />
        </Item>

        <Item
          label="Title"
          name="Title"
          extra="Max character count of 45"
          rules={[getRequiredRule("Please enter a title for your listing!")]}
        >
          <Input
            maxLength={45}
            placeholder="The iconic and luxurious Bel-Air mansion"
          />
        </Item>

        <Item
          label="Description of listing"
          name="Description of listing"
          extra="Max character count of 400"
          rules={[
            getRequiredRule("Please enter a description for your listing!"),
          ]}
        >
          <Input.TextArea
            rows={3}
            maxLength={400}
            placeholder="Modern, clean, and iconic home of the Fresh Prince. Situated in the heart of Bel-Air, Los Angeles."
          />
        </Item>

        <Item
          label="Address"
          name="Address"
          rules={[getRequiredRule("Please enter an address for your listing!")]}
        >
          <Input placeholder="251 North Bristol Avenue" />
        </Item>

        <Item
          label="City/Town"
          name="City/Town"
          rules={[
            getRequiredRule(
              "Please enter a city (or region) for your listing!"
            ),
          ]}
        >
          <Input placeholder="Los Angeles" />
        </Item>

        <Item
          label="State/Province"
          name="State/Province"
          rules={[getRequiredRule("Please enter a state for your listing!")]}
        >
          <Input placeholder="California" />
        </Item>

        <Item
          label="Zip/Postal Code"
          name="Zip/Postal Code"
          rules={[getRequiredRule("Please enter a zip code for your listing!")]}
        >
          <Input placeholder="Please enter a zip code for your listing!" />
        </Item>

        <Item
          label="Image"
          name="Image"
          extra="Images have to be under 1MB in size and of type JPG or PNG"
          rules={[
            getRequiredRule("Please enter provide an image for your listing!"),
          ]}
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase64Value && <img src={imageBase64Value} alt="Listing" />}
              {!imageBase64Value && (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item
          label="Price"
          name="Price"
          extra="All prices in $USD/day"
          rules={[getRequiredRule("Please enter a price for your listing!")]}
        >
          <InputNumber min={0} placeholder="120" />
        </Item>

        <Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Item>
      </Form>
    </Content>
  );
};

const beforeImageUpload = (file: File) => {
  const fileIsValidImage = ["image/jpeg", "image/png"].includes(file.type);
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  console.log("1111111111");
  if (!fileIsValidImage) {
    displayErrorMessage("You're only able to upload valid JPG or PNG files!");
    return false;
  }

  if (!fileIsValidSize) {
    displayErrorMessage(
      "You're only able to upload valid image files of under 1MB in size!"
    );
    return false;
  }
  console.log("2222222222", file);

  return true;
};

const getBase64Value = (
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callback(reader.result as string);
  };
};

export default Host;
