export default function Datenschutz({ locale }: { locale: string }) {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {locale === 'de' ? 'Datenschutzerklärung' : locale === 'en' ? 'Privacy Policy' : 'Политика конфиденциальности'}
      </h1>
      
      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'de' ? '1. Datenschutz auf einen Blick' : locale === 'en' ? '1. Privacy at a glance' : '1. Конфиденциальность одним взглядом'}
          </h2>
          <p>
            {locale === 'de' 
              ? 'Diese Webseite nutzt keine Cookies und speichert keine personenbezogenen Daten ohne Ihre ausdrückliche Einwilligung.' 
              : locale === 'en' 
                ? 'This website does not use cookies and does not store personal data without your explicit consent.' 
                : 'Этот сайт не использует cookies и не хранит персональные данные без вашего явного согласия.'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'de' ? '2. Allgemeine Hinweise' : locale === 'en' ? '2. General Information' : '2. Общая информация'}
          </h2>
          <p>
            {locale === 'de' 
              ? 'Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften.' 
              : locale === 'en' 
                ? 'The operators of this website take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with statutory data protection provisions.' 
                : 'Операторы этого сайта очень серьезно относятся к защите ваших персональных данных. Мы обрабатываем ваши персональные данные конфиденциально и в соответствии с законодательными положениями о защите данных.'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'de' ? '3. Datenerfassung auf dieser Webseite' : locale === 'en' ? '3. Data collection on this website' : '3. Сбор данных на этом сайте'}
          </h2>
          
          <h3 className="text-lg font-medium mb-2">
            {locale === 'de' ? 'Kontaktaufnahme' : locale === 'en' ? 'Contact' : 'Контакты'}
          </h3>
          <p>
            {locale === 'de' 
              ? 'Wenn Sie uns per Kontaktformular oder E-Mail kontaktieren, werden Ihre Angaben inklusive der von Ihnen angegebenen Kontaktdaten zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Eine Löschung Ihrer Daten ist jederzeit möglich.' 
              : locale === 'en' 
                ? 'If you contact us via contact form or email, your details including the contact data you provided will be stored by us to process your inquiry and in case of follow-up questions. Deletion of your data is possible at any time.' 
                : 'Если вы свяжетесь с нами через контактную форму или электронную почту, ваши данные, включая предоставленные контактные данные, будут храниться у нас для обработки вашего запроса и в случае последующих вопросов. Удаление ваших данных возможно в любое время.'}
          </p>

          <h3 className="text-lg font-medium mb-2 mt-4">
            {locale === 'de' ? 'Online-Reservierung' : locale === 'en' ? 'Online Reservation' : 'Онлайн бронирование'}
          </h3>
          <p>
            {locale === 'de' 
              ? 'Bei einer Reservierung speichern wir Name, E-Mail, Telefonnummer, Datum, Uhrzeit und die Anzahl der Gäste. Die Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).' 
              : locale === 'en' 
                ? 'For reservations, we store name, email, phone number, date, time, and number of guests. Data processing is based on Art. 6(1)(b) GDPR (contract performance).' 
                : 'При бронировании мы храним имя, электронную почту, номер телефона, дату, время и количество гостей. Обработка данных осуществляется на основании ст. 6(1)(b) GDPR (исполнение договора).'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'de' ? '4. Ihre Rechte' : locale === 'en' ? '4. Your Rights' : '4. Ваши права'}
          </h2>
          <p>
            {locale === 'de' 
              ? 'Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Datenübertragbarkeit. Kontaktieren Sie uns unter info@lateliergourmet.de.' 
              : locale === 'en' 
                ? 'You have the right to access your stored data, rectification, erasure, restriction of processing, and data portability. Contact us at info@lateliergourmet.de.' 
                : 'Вы имеете право на доступ к вашим сохраненным данным, исправление, удаление, ограничение обработки, а также переносимость данных. Свяжитесь с нами по адресу info@lateliergourmet.de.'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'de' ? '5. Verantwortlicher' : locale === 'en' ? '5. Responsible Party' : '5. Ответственная сторона'}
          </h2>
          <p>Julia Schmidt</p>
          <p>Hauptstraße 1, 10115 Berlin</p>
          <p>E-Mail: info@lateliergourmet.de</p>
        </section>
      </div>
    </div>
  )
}