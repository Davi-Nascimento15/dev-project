import { useNavigate } from "react-router-dom";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import { TextFormField } from "@/components/form/TextFormField/TextFormField";
import Loader from "@/components/Loader";
import { toastr } from "@/utils/toastr";
import React, { Suspense,  useState } from "react";
import { Button, Card,  Form, Row } from "react-bootstrap";
import UserService from "@/services/UserService";
import ClientService from "@/services/ClientService";

interface ImportClientProps {
    onClose: () => void;
}

const ImportClient = ({onClose}:ImportClientProps) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<string>('');
  const [isSubmitting, setIsSubmiting] = useState<boolean>(false);

  async function ImportFile(file:any){
      if(file.target.value){
          const reader = new FileReader();
          reader.onload = async (e:any) => {
              const base64String = e.target.result; 
              setFile(base64String);
          };
          reader.readAsDataURL(file.target.value);
      }
  }

  async function onSubmit(event:any) {
    event.preventDefault();
    try {
      if(file) {
        setIsSubmiting(true)
        await ClientService.import({csvFile:file});
        onClose();
        toastr({ title: "Arquivo importado com sucesso", icon: "success" });
        setIsSubmiting(false);
      }
    } catch (err: any) {
      toastr({ title: "Erro", text: err.message, icon: "error" });
    }
  }

  return (
    <React.Fragment>
      <Suspense fallback={<><Loader /><br /><br /></>}>
        <Card>
          <Card.Body>
            <Form noValidate onSubmit={onSubmit}>
              <Row>
                <TextFormField
                  componentType={TextFormFieldType.IMAGE}
                  name="file"
                  required
                  handleChange={(event)=>{ImportFile(event)}}
                />
                <br />
                <br />
                <Button type="submit" variant="primary" disabled={!file || isSubmitting} style={{ margin: "15px 0 0" }}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Suspense>
    </React.Fragment>
  );
};

export default ImportClient;