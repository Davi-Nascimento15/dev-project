import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_PATH } from "@/constants";
import { Client } from "@/types/api/Client";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import { TextFormField } from "@/components/form/TextFormField/TextFormField";
import Loader from "@/components/Loader";
import { toastr } from "@/utils/toastr";
import ClientService from "@/services/ClientService";
import { handlePhoneNumberChange } from "@/helpers/handlePhoneNumberChange";
import yup from "@/utils/yup";
import React, { Suspense, useMemo } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Formik } from "formik";
import { parse, format } from 'date-fns';
import moment from "moment";

const INITIAL_VALUES: Client = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  birthDate: undefined,
  documentNumber: "",
  address: {
    postalCode: "",
    addressLine: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  },
};

const schemaValidation = yup.object().shape({
  firstName: yup.string().required("Nome é obrigatório"),
  lastName: yup.string().required("Sobrenome é obrigatório"),
  phoneNumber: yup.string().required("Telefone é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  birthDate: yup.date().transform((value, originalValue) => {
      if (typeof originalValue === 'string') {
        const [day, month, year] = originalValue.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
          return date;
        }
      }

      if (value instanceof Date && !isNaN(value.getTime())) return value;
      
      return new Date('');
    }).typeError('Data inválida. Use o formato dd/MM/yyyy')
    .required('A data de nascimento é obrigatória')
    .max(new Date(), 'A data não pode ser no futuro'),
  documentNumber: yup.string().required("Documento é obrigatório"),
  address: yup.object().shape({
    postalCode: yup.string().required("CEP é obrigatório"),
    addressLine: yup.string().required("Endereço é obrigatório"),
    number: yup.string().required("Número é obrigatório"),
    neighborhood: yup.string().required("Bairro é obrigatório"),
    city: yup.string().required("Cidade é obrigatória"),
    state: yup.string().required("Estado é obrigatório"),
  }),
});

interface ClientFormProps {
  dataClient?: Client;
  onClose: () => void;
}

const ClientForm = ({ dataClient, onClose }: ClientFormProps) => {
  const navigate = useNavigate();
 
  const initialValues = useMemo(() => {
    if (dataClient) {
      return {
        ...dataClient,
        
        birthDate: dataClient.birthDate ? new Date(dataClient.birthDate) : undefined
      };
    }
    return INITIAL_VALUES;
  }, [dataClient]);

  function convertDate(values: Client): string |undefined{
    if(!values.birthDate)
      return undefined;
    if(values.birthDate instanceof Date)
      return moment(values.birthDate).format("DD/MM/YYYY");
    
    const parsedDate = parse(values.birthDate, 'dd/MM/yyyy', new Date());
    values.birthDate = parsedDate;
    return format(parsedDate, 'yyyy-MM-dd');
  }

  async function onSubmit(values: Client) {
    try {
      const clientToSave: Client = {
        ...values,
        phoneNumber: values.phoneNumber.replace(/\D/g, ''),
        address: {
          ...values.address,
          postalCode: values.address.postalCode.replace(/\D/g, ''),
        },
      };

      if(dataClient){
        await ClientService.update(dataClient.id!, clientToSave);
        toastr({ title: "Cliente atualizado com sucesso", icon: "success" });
        onClose();
      }else{
        await ClientService.create(clientToSave);
        toastr({ title: "Cliente criado com sucesso", icon: "success" });
        navigate(NAVIGATION_PATH.CLIENTS.LISTING.ABSOLUTE);
      }
    } catch (err: any) {
      toastr({ title: "Erro", text: err.message, icon: "error" });
    }
  }

  const title = "Novo Cliente";

  return (
    <React.Fragment>
      {!dataClient ? <Helmet title={title} /> : ''}
      <Suspense fallback={<><Loader /><br /><br /></>}>
        <Card>
          {!dataClient ?
            <Card.Header>
              <Card.Title>{title}</Card.Title>
            </Card.Header> : ''
          }
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={schemaValidation}
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
                        name="firstName"
                        label="Nome"
                        required
                        placeholder="Nome"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.firstName}
                        formikError={errors.firstName}
                      />
                    </Col>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="lastName"
                        label="Sobrenome"
                        required
                        placeholder="Sobrenome"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.lastName}
                        formikError={errors.lastName}
                      />
                    </Col>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="email"
                        label="Email"
                        required
                        placeholder="Email"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.email}
                        formikError={errors.email}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="phoneNumber"
                        label="Telefone"
                        required
                        placeholder="Telefone"
                        handleBlur={handleBlur}
                        handleChange={(evnt) => handlePhoneNumberChange(evnt, handleChange)}
                        value={values.phoneNumber}
                        formikError={errors.phoneNumber}
                      />
                    </Col>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="documentNumber"
                        label="Documento"
                        required
                        placeholder="Documento"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.documentNumber}
                        formikError={errors.documentNumber}
                      />
                    </Col>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.DATE_PICKER}
                        name="birthDate"
                        label="Data de Nascimento"
                        required
                        placeholder="Data de Nascimento"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={convertDate(values)}
                        formikError={errors.birthDate}
                      />
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="address.postalCode"
                        label="CEP"
                        required
                        placeholder="CEP"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.address.postalCode}
                        formikError={errors.address?.postalCode}
                      />
                    </Col>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="address.addressLine"
                        label="Endereço"
                        required
                        placeholder="Endereço"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.address.addressLine}
                        formikError={errors.address?.addressLine}
                      />
                    </Col>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="address.number"
                        label="Número"
                        required
                        placeholder="Número"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.address.number}
                        formikError={errors.address?.number}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="address.complement"
                        label="Complemento"
                        placeholder="Complemento"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.address.complement}
                        formikError={errors.address?.complement}
                      />
                    </Col>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="address.neighborhood"
                        label="Bairro"
                        required
                        placeholder="Bairro"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.address.neighborhood}
                        formikError={errors.address?.neighborhood}
                      />
                    </Col>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="address.city"
                        label="Cidade"
                        required
                        placeholder="Cidade"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.address.city}
                        formikError={errors.address?.city}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <TextFormField
                        componentType={TextFormFieldType.INPUT}
                        name="address.state"
                        label="Estado"
                        required
                        placeholder="Estado"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        value={values.address.state}
                        formikError={errors.address?.state}
                      />
                    </Col>
                  </Row>
                  <br />
                  <Button type="submit" variant="primary" disabled={!isValid || isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                  {dataClient ? '':
                    <Button
                      variant="secondary"
                      style={{ marginLeft: 5 }}
                      onClick={() => navigate(NAVIGATION_PATH.CLIENTS.LISTING.ABSOLUTE)}
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