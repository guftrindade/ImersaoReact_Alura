import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import {useRouter} from 'next/router';
import {createClient} from '@supabase/supabase-js';
import {ButtonSendSticker} from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM4NDEyMCwiZXhwIjoxOTU4OTYwMTIwfQ.ro7dFIS9uCYZXWOjJbPh_gtyZgagfeJAY3BAps-JULY';
const SUPABASE_URL = 'https://cpsoeylcsbxgrheniqga.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagemEmTempoReal(adicionaMensagem){
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new)
        })
        .subscribe();
}

export default function ChatPage() {

    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', {ascending: false})
            .then(({data}) => {
                setListaDeMensagens(data);
            });

        escutaMensagemEmTempoReal((novaMensagem) =>{
            setListaDeMensagens((valorAtualDaLista) => {
                return [
                    novaMensagem,
                    ...valorAtualDaLista,
                ]
            });
        });
    }, []);

    function handleNovaMensagem(novaMensagem){
        const mensagem = {
            de: usuarioLogado,
            texto: novaMensagem,
        };

        supabaseClient
            .from('mensagens')
            .insert([
                mensagem
            ])
            .then(({data}) => {
                console.log(data);
            });

        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                //backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://images2.alphacoders.com/515/515958.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '15px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '80%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '20px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaDeMensagens}/>

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event)=> {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event)=>{
                                if(event.key ==='Enter'){
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}

                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClick={(sticker) =>{
                                handleNovaMensagem(':sticker: ' + sticker);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return(
                    <Text
                        key={mensagem.id}
                            tag="li"
                            styleSheet={{
                                borderRadius: '5px',
                                padding: '6px',
                                marginBottom: '12px',
                                hover: {
                                    backgroundColor: appConfig.theme.colors.neutrals[700],
                                }
                            }}
                        >
                        <Box
                            styleSheet={{
                                marginBottom: '10px',
                            }}
                        >

                            <Image
                                styleSheet={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>

                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>

                        </Box>
                        {mensagem.texto.startsWith(':sticker:') ?
                            (<Image src={mensagem.texto.replace(':sticker:', '')}/>) :
                            (mensagem.texto)}
                    </Text>
                );
            })}   
        </Box>
    )
}