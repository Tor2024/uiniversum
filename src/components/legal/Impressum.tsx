export default function Impressum({ locale }: { locale: string }) {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {locale === 'de' ? 'Impressum' : locale === 'en' ? 'Legal Notice' : 'Юридическая информация'}
      </h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-2">
            {locale === 'de' ? 'Angaben gemäß § 5 DDG' : locale === 'en' ? 'Disclosure pursuant to § 5 DDG' : 'Раскрытие информации согласно § 5 DDG'}
          </h2>
          <p className="font-medium">L'Atelier Gourmet</p>
          <p>Vertreten durch: Geschäftsführer Julia Schmidt</p>
          <p>Hauptstraße 1</p>
          <p>10115 Berlin</p>
          <p>Deutschland</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            {locale === 'de' ? 'Kontakt' : locale === 'en' ? 'Contact' : 'Контакты'}
          </h2>
          <p>
            {locale === 'de' ? 'Telefon' : locale === 'en' ? 'Phone' : 'Телефон'}: +49 30 1234567
          </p>
          <p>
            E-Mail: <a href="mailto:info@lateliergourmet.de" className="text-accent hover:underline">info@lateliergourmet.de</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            {locale === 'de' ? 'Umsatzsteuer-ID' : locale === 'en' ? 'VAT ID' : 'ИНН / НДС'}
          </h2>
          <p>
            {locale === 'de' ? 'Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz' : locale === 'en' ? 'VAT identification number pursuant to Section 27 a of the Turnover Tax Act' : 'Идентификационный номер НДС согласно § 27 a Закона о налоге с оборота'}
            : DE123456789
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            {locale === 'de' ? 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV' : locale === 'en' ? 'Responsible for content pursuant to § 18 para. 2 MStV' : 'Ответственный за контент согласно § 18 абз. 2 MStV'}
          </h2>
          <p>Julia Schmidt</p>
          <p>Hauptstraße 1, 10115 Berlin</p>
        </section>
      </div>
    </div>
  )
}