import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_PATH } from "@/constants";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import { TextFormField } from "@/components/form/TextFormField/TextFormField";
import Loader from "@/components/Loader";
import { toastr } from "@/utils/toastr";
import yup from "@/utils/yup";
import React, { Suspense, useMemo } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Formik } from "formik";
import { User } from "@/types/api/User";
import { UserProfile, userProfileOptions } from "@/types/api/enums/UserProfile";
import UserService from "@/services/UserService";

let INITIAL_VALUES: User = {
    id: '',
    username: '',
    password: '',
    profile: UserProfile.Administrator,
    createdAt:''
};

interface UserFormProps {
  dataUser?: User;
  onClose: () => void;
}

const getSchema = (isUpdate: boolean) => yup.object().shape({
  username: yup.string().required("Nome é obrigatório"),
  profile: yup.string().required("Tipo de Perfil obrigatório"),
  password: isUpdate 
    ? yup.string().notRequired()
    : yup.string().required("Senha é obrigatória")
});

const ClientForm = ({ dataUser, onClose }: UserFormProps) => {
  const navigate = useNavigate();

  const validationSchema = useMemo(() => {
    return getSchema(!!dataUser);
  }, [dataUser]);
 
  const initialValues = useMemo(() => {
    if (dataUser) {
      
      return {
        ...dataUser,
        createdAt: dataUser.createdAt ? new Date(dataUser.createdAt).toString() : '',
        profile: String(dataUser.profile) =='Administrator'? UserProfile.Administrator : UserProfile.Operator
      };
    }
    return INITIAL_VALUES;
  }, [dataUser]);

  async function onSubmit(values: User) {
    try {
      const userToSave: User = {
        ...values
      };

      if(dataUser) {
        await UserService.update(dataUser.id!, userToSave);
        toastr({ title: "Usuário atualizado com sucesso", icon: "success" });
        onClose();
      }else{
        await UserService.create(userToSave);
        toastr({ title: "Usuário criado com sucesso", icon: "success" });
        navigate(NAVIGATION_PATH.USERS.LISTING.ABSOLUTE);
      }
    } catch (err: any) {
      toastr({ title: "Erro", text: err.message, icon: "error" });
    }
  }

  const title = "Novo Usuário";

  return (
    <React.Fragment>
      {!dataUser ? <Helmet title={title} /> : ''}
      <Suspense fallback={<><Loader /><br /><br /></>}>
        <Card>
          {!dataUser ?
            <Card.Header>
              <Card.Title>{title}</Card.Title>
            </Card.Header> : ''
          }
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              enableReinitialize={true}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                errors,
                values,
                isSubmitting,
                isValid,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Row>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="username"
                        label="Nome de usuário"
                        required
                        placeholder="Nome do usuário"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.username}
                        formikError={errors.username}
                      />
                    </Col>
                    {!dataUser ?
                        <Col md={4}>
                          <TextFormField
                            componentType={TextFormFieldType.INPUT}
                            name="password"
                            label="Senha"
                            password
                            required={!dataUser}
                            placeholder="Senha"
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            value={values.password}
                            formikError={errors.password}
                          />
                        </Col>
                      :''}
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.SELECT}
                        name="profile"
                        label="Tipo de Perfil"
                        required
                        options = {userProfileOptions()}
                        placeholder="Selecione"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.profile}
                        formikError={errors.profile}
                      />
                    </Col>
                  </Row>
                  <br />
                  <Button type="submit" variant="primary" disabled={!isValid || isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                  {dataUser ? '':
                    <Button
                      variant="secondary"
                      style={{ marginLeft: 5 }}
                      onClick={() => navigate(NAVIGATION_PATH.USERS.LISTING.ABSOLUTE)}
                    >
                      Voltar
                    </Button>
                  }
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Suspense>
    </React.Fragment>
  );
};

export default ClientForm;