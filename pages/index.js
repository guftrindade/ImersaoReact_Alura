import React from 'react';
import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import appConfig from '../config.json';
import {useRouter} from 'next/router';
import { urlObjectKeys } from 'next/dist/shared/lib/utils';


function Titulo(props) {
  const Tag = props.tag || 'h1';
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
            ${Tag} {
                color: black;
                font-size: 24px;
                font-weight: 600;
            }
            `}</style>
    </>
  );
}

export default function PaginaInicial() {
  const [username, setUsername] = React.useState("guftrindade");
  const roteamento = useRouter();

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          //backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: 'url(https://images2.alphacoders.com/515/515958.jpg)',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%', maxWidth: '700px',
            borderRadius: '15px', padding: '32px', margin: '16px',
            boxShadow: '0 2px 20px 0 black',
            backgroundColor: "white",
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function(infosDoEvento){
              infosDoEvento.preventDefault();
              roteamento.push(`/chat?username=${username}`);
            }}

            styleSheet={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
            }}
          >

            <Titulo tag="h2">Bem vindo</Titulo>
            <Text variant="body3" styleSheet={{ marginBottom: '32px', color: 'black' }}>
              {appConfig.name}
            </Text>

            <TextField
              value={username}
              onChange={function(event){
                const valor = event.target.value;
                setUsername(valor);
              }}
                fullWidth
                textFieldColors={{
                  neutral: {
                    textColor: appConfig.theme.colors.neutrals[200],
                    mainColor: appConfig.theme.colors.neutrals[900],
                    mainColorHighlight: appConfig.theme.colors.primary[500],
                    backgroundColor: appConfig.theme.colors.neutrals[800],
                  },
                }}
            />

            <Button
              type='submit'
              label='Entrar'
              fullWidth
              buttonColors={{
                contrastColor: "black",
                mainColor: "white",
                mainColorLight: "red",
                mainColorStrong: "yellow",
              }}
            />
          </Box>
          {/* Formulário */}


          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: "white",
              border: '3px solid',
              borderColor: "black",
              borderRadius: '10px',
              flex: 1,
              minHeight: '240px',
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px',
              }}
              src={`https://github.com/${username}.png`}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                fontSize: '13px',
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >
              {username}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}