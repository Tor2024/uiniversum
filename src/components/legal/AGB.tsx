export default function AGB({ locale }: { locale: string }) {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {locale === 'de' ? 'Allgemeine Geschäftsbedingungen' : locale === 'en' ? 'Terms and Conditions' : 'Общие условия бизнеса'}
      </h1>
      
      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'de' ? '§ 1 Geltungsbereich' : locale === 'en' ? '§ 1 Scope' : '§ 1 Сфера действия'}
          </h2>
          <p>
            {locale === 'de' 
              ? "Diese AGB gelten für alle über unsere Webseite abgeschlossenen Verträge zwischen L'Atelier Gourmet und dem Kunden." 
              : locale === 'en' 
                ? "These T&C apply to all contracts concluded via our website between L'Atelier Gourmet and the customer." 
                : "Данные ОУБ применяются ко всем договорам, заключенным через наш сайт между L'Atelier Gourmet и клиентом."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'de' ? '§ 2 Reservierung und Buchung' : locale === 'en' ? '§ 2 Reservation and Booking' : '§ 2 Бронирование и заказ'}
          </h2>
          <p>
            {locale === 'de' 
              ? 'Eine Reservierung ist verbindlich. Bei Nichterscheinen (No-Show) behalten wir uns vor, eine Ausfallgebühr in Höhe von 50€ zu erheben.' 
              : locale === 'en' 
                ? 'A reservation is binding. In case of no-show, we reserve the right to charge a cancellation fee of 50€.' 
                : 'Бронирование является обязывающим. В случае неявки мы оставляем за собой право взимать плату за отмену в размере 50€.'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'de' ? '§ 3 Stornierung' : locale === 'en' ? '§ 3 Cancellation' : '§ 3 Отмена'}
          </h2>
          <p>
            {locale === 'de' 
              ? 'Eine kostenfreie Stornierung ist bis zu 24 Stunden vor dem Reservierungszeitpunkt möglich. Danach fällt die volle Gebühr an.' 
              : locale === 'en' 
                ? 'Free cancellation is possible up to 24 hours before the reservation time. After that, the full fee applies.' 
                : 'Бесплатная отмена возможна до 24 часов до времени бронирования. После этого взимается полная плата.'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'de' ? '§ 4 Zahlung' : locale === 'en' ? '§ 4 Payment' : '§ 4 Оплата'}
          </h2>
          <p>
            {locale === 'de' 
              ? 'Die Zahlung erfolgt direkt im Restaurant. Wir akzeptieren Barzahlung sowie gängige Kreditkarten (Visa, Mastercard).' 
              : locale === 'en' 
                ? 'Payment is made directly at the restaurant. We accept cash and major credit cards (Visa, Mastercard).' 
                : 'Оплата производится непосредственно в ресторане. Мы принимаем наличные и основные кредитные карты (Visa, Mastercard).'}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'de' ? '§ 5 Haftung' : locale === 'en' ? '§ 5 Liability' : '§ 5 Ответственность'}
          </h2>
          <p>
            {locale === 'de' 
              ? "L'Atelier Gourmet haftet nicht für leichte Fahrlässigkeit. Die Haftung für Personenschäden bleibt unberührt." 
              : locale === 'en' 
                ? "L'Atelier Gourmet is not liable for slight negligence. Liability for personal injury remains unaffected." 
                : "L'Atelier Gourmet не несет ответственности за легкую небрежность. Ответственность за вред жизни и здоровью остается неизменной."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'de' ? '§ 6 Gerichtsstand' : locale === 'en' ? '§ 6 Jurisdiction' : '§ 6 Подсудность'}
          </h2>
          <p>
            {locale === 'de' 
              ? 'Gerichtsstand ist Berlin, sofern der Kunde Kaufmann ist. Es gilt das Recht der Bundesrepublik Deutschland.' 
              : locale === 'en' 
                ? 'The place of jurisdiction is Berlin, provided the customer is a merchant. The law of the Federal Republic of Germany applies.' 
                : 'Место юрисдикции - Берлин, при условии что клиент является коммерсантом. Применяется право Федеративной Республики Германия.'}
          </p>
        </section>
      </div>
    </div>
  )
}
