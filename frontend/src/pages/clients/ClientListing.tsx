import { Suspense, useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { NAVIGATION_PATH } from "@/constants";
import { Client } from "@/types/api/Client";
import DataTable from "@/components/DataTable";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import ClientService from "@/services/ClientService";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import CustomModal from "@/components/CustomModal";
import ClientForm from "./ClientForm";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import ImportClient from "./ClientImport";
import { useDialog } from "@/contexts/DialogContext";

const ClientListing = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [date, setDate] = useState<Date>();
    const [showModal, setModal] = useState<({show:boolean, data:Client|undefined})>({show:false, data:undefined});
    const [showImportModal, setImportModal] = useState<boolean>(false);
    const { showDialog } = useDialog();

    useEffect(() => {
        setDate(new Date());
    }, []);

    function handleActionClick(client:Client){
        setModal({show:true, data:client});
    }

    async function closeModal(){
        setModal({show:false, data:undefined});
        await queryClient.invalidateQueries({  queryKey: [["client", "listing", date]],exact: false});
    }

    return <>
        <Row style={{ justifyContent: "end", margin: "10px 0" }}>
            <Link to={NAVIGATION_PATH.CLIENTS.CREATE.ABSOLUTE}>
                <Button style={{ maxWidth: "fit-content", float: "right" }}>Adicionar</Button>
            </Link>
        </Row>
        <Row style={{ justifyContent: "end", margin: "10px 0" }}>
            <Button style={{ maxWidth: "fit-content", float: "right", marginRight: '13px', minWidth: '87.45px' }} variant="secondary" onClick={()=> setImportModal(true)}>Importar</Button>
        </Row>
        <CustomModal onHide={()=>setModal({show:false, data:undefined})} show={showModal.show} children={ClientForm({dataClient: showModal.data, onClose:()=>{closeModal()}})}  header={{title:'Atualizar', closeButton:true}}></CustomModal>
        <CustomModal onHide={()=>setImportModal(false)} show={showImportModal} children={ImportClient({onClose:()=>{setImportModal(false)}})} header={{title:'Importar Arquivo', closeButton:true}}></CustomModal>
        <Card >
            <Card.Title></Card.Title>
            <Card.Header>
                <Card.Title>
                    Clientes
                </Card.Title>
            </Card.Header>
            <Suspense fallback={<><Loader /><br /><br /></>}>
                <DataTable<Client, any>
                    thin
                    columns={[
                        
                        { Header: "Nome", accessor: "firstName" },
                        { Header: "Sobrenome", accessor: "lastName" },
                        { Header: "Email", accessor: "email" },
                        { Header: "Telefone", accessor: "phoneNumber" },
                        { Header: "Documento", accessor: "documentNumber" },
                        { Header: "Data de Nascimento", accessor: "birthDate",Cell: ({ value }: { value: Date |string|undefined }) => {
                                    if (!value) return "";
                                    const date = new Date(value);
                                    return moment(date).format('DD/MM/YYYY');
                        }},
                        {
                            Header: "Ações",
                            id: "actions",
                            Cell: ({ row }: { row: { original: Client} }) => (
                            <div style={{display:'flex', flexWrap:'wrap',gap:'10px' }}>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleActionClick(row.original)}
                                    >
                                    Editar
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => {
                                            showDialog({
                                                title: "Confirmar Exclusão",
                                                message: `Tem certeza que deseja excluir o cliente ${row.original.firstName + ' ' + row.original.lastName}?`,
                                                actions: [
                                                            {   
                                                            label: "Cancelar",
                                                            color: "inherit",
                                                            onClick: () =>{},
                                                            },
                                                            {
                                                            label: "Excluir",
                                                            color: "primary",
                                                            onClick: async () => {
                                                                await ClientService.deleteClient(row.original.id!);
                                                                await queryClient.invalidateQueries({  queryKey: [["client", "listing", date]],exact: false});
                                                            }
                                                            }
                                                        ]
                                                });}}
                                    >
                                    Excluir
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                    query={async (filters) => {
                        if(!filters.find(x=>x.name=='document' && x.value))
                            return await ClientService.getAll();
                        else
                            return await ClientService.getbyDocument(filters.find(x=>x.name=='document' && x.value)!.value as string);
                    }}
                    fetchButton
                    cleanButton
                    filters={[{
                        componentType: TextFormFieldType.INPUT,
                        name: "document",
                        label: "Documento",
                        placeholder: "Digite o documento",
                        col: 10
                    }]}
                    queryName={["client", "listing", date]}
                />
            </Suspense>
        </Card >
    </>
}

export default ClientListing;