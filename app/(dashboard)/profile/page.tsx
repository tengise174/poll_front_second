"use client";
import { useEffect, useState } from "react";
import profileContent from "./utils/content";
import { Button, Form, Input, Row } from "antd";

const ProfilePage = () => {
  const [form] = Form.useForm();

  const [hydration, setHydration] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(undefined);

  useEffect(() => {
    setHydration(true);
    const profile = localStorage.getItem("profile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.usertype === "COMPANY") {
        setCurrentUser(profileContent.COMPANY);
      } else {
        setCurrentUser(profileContent.PERSON);
      }
    }
  }, [userProfile]);

  const handleSubmit = () => {
    console.log(form.getFieldsValue());
  }

  if (!hydration) {
    return null;
  }

  return (
    <div>
      {currentUser === undefined ? (
        <div>good</div>
      ) : (
        <div>
          <p>{currentUser.title}</p>
          <p>{currentUser.description}</p>

          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]}>
              <div>
                {(currentUser as any).content.map(
                  (item: any, index: number) => (
                    <Form.Item key={index} label={item.label} 
                    name={item.name}
                    initialValue={userProfile[item.name]}
                    >
                      <Input
                        key={index}
                        itemType={item.itemType}
                      />
                    </Form.Item>
                  )
                )}
              </div>
              <Form.Item label={null}>
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
