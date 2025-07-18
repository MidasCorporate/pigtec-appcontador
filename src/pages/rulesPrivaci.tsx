import { useRouteError, Link } from 'react-router-dom'

export function Rules() {
  const error = useRouteError() as Error

  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 py-8 text-center gap-6">


      <section className="max-w-2xl text-left text-accent-foreground">
        <h2 className="text-2xl font-semibold mb-4">🐷 Política de Privacidade</h2>
        <p className="mb-2 text-sm">Última atualização: 18 de julho de 2025</p>

        <ol className="list-decimal pl-4 space-y-4 text-sm leading-relaxed">
          <li>
            <strong>Informações Coletadas:</strong>
            <ul className="list-disc pl-5 mt-1">
              <li>Imagens e vídeos da câmera do dispositivo, usados exclusivamente para contagem automatizada dos suínos.</li>
              <li>Dados estatísticos anônimos, como número de leitões detectados e horário de uso.</li>
              <li>Informações do dispositivo (modelo, sistema operacional, idioma) para fins de diagnóstico.</li>
              <li><strong>Não coletamos dados pessoais</strong> como nome, e-mail, localização ou documentos.</li>
            </ul>
          </li>

          <li>
            <strong>Uso das Informações:</strong> As informações são utilizadas para melhorar a precisão da contagem, otimizar o desempenho do sistema e aprimorar a experiência do usuário.
          </li>

          <li>
            <strong>Compartilhamento de Dados:</strong> Não compartilhamos dados com terceiros, exceto por obrigação legal ou investigação de uso indevido.
          </li>

          <li>
            <strong>Crianças:</strong> O aplicativo não é destinado a menores de 13 anos. Identificações indevidas serão removidas.
          </li>

          <li>
            <strong>Segurança:</strong> Adotamos medidas técnicas rigorosas para proteger as informações contra acessos não autorizados.
          </li>

          <li>
            <strong>Consentimento:</strong> Ao utilizar o aplicativo, você concorda com esta política. Caso discorde, descontinue o uso.
          </li>

          <li>
            <strong>Alterações na Política:</strong> Esta política pode ser atualizada. A data da última modificação estará sempre visível.
          </li>

          <li>
            <strong>Contato:</strong><br />
            📧 <a href="mailto:bruno.carvalho@inovagrotec.com.br" className="underline">bruno.carvalho@inovagrotec.com.br</a><br />
            🌐 <a href="https://inovagrotec.com.br" target="_blank" rel="noopener noreferrer" className="underline">inovagrotec.com.br</a>
          </li>
        </ol>
      </section>

      <div className="text-sm text-muted-foreground">
        <p>
          Voltar para o{' '}
          <Link to="/" className="text-sky-600 hover:underline dark:text-sky-400">
            Dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
