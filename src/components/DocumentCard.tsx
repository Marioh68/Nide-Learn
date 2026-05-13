'use client';

import type { DocumentTemplate, DocumentType } from '@/types/exercises';

const MONTH_NAMES = [
  'Marraskuu', 'Joulukuu', 'Tammikuu', 'Helmikuu', 'Maaliskuu',
];

const TYPE_LABELS: Record<DocumentType, string> = {
  yksityissijoitus:  'Yksityissijoitus',
  yksityisnosto:     'Yksityisnosto',
  myyntilasku:       'Myyntilasku',
  ostolasku:         'Ostolasku',
  kuitti:            'Kuitti',
  tiliotetapahtuma:  'Tiliotetapahtuma',
  muistiotosite:     'Muistiotosite',
};

interface DocumentCardProps {
  template: DocumentTemplate;
  /** month offset used to derive display month name */
  baseMonthOffset?: number;
}

export function DocumentCard({ template }: DocumentCardProps) {
  const monthName = MONTH_NAMES[template.monthOffset] ?? `Kuukausi ${template.monthOffset + 1}`;
  const dateStr = `${monthName} ${template.day}.`;
  const typeLabel = TYPE_LABELS[template.type];
  const fmt = (n: number) => n.toLocaleString('fi-FI', { minimumFractionDigits: 2 });

  // ALV breakdown — only shown when vatRate is set
  const hasVat = template.vatRate !== undefined && template.vatRate > 0;
  const vatRate = template.vatRate ?? 0;
  const vatMultiplier = 1 + vatRate / 100;
  const netAmount = hasVat ? template.amount / vatMultiplier : template.amount;
  const vatAmount = hasVat ? template.amount - netAmount : 0;

  return (
    <div className={`doc-card doc-card-${template.type}`}>
      <div className="doc-card-header">
        <span className="doc-type-badge">{typeLabel}</span>
        <span className="doc-date">{dateStr}</span>
      </div>

      <div className="doc-card-body">
        <p className="doc-description">{template.description}</p>

        <dl className="doc-fields">
          {template.counterparty && (
            <>
              <dt>Vastapuoli</dt>
              <dd>{template.counterparty}</dd>
            </>
          )}
          {template.invoiceNumber && (
            <>
              <dt>Laskunumero</dt>
              <dd>{template.invoiceNumber}</dd>
            </>
          )}
          {template.referenceNumber && (
            <>
              <dt>Viitenumero</dt>
              <dd>{template.referenceNumber}</dd>
            </>
          )}
          {template.paymentTerm && (
            <>
              <dt>Maksuehto</dt>
              <dd>{template.paymentTerm}</dd>
            </>
          )}
        </dl>
      </div>

      <div className="doc-card-footer">
        {hasVat ? (
          <div className="doc-alv-breakdown">
            <div className="doc-alv-row">
              <span className="doc-alv-label">Veroton</span>
              <span className="doc-alv-val">{fmt(netAmount)} €</span>
            </div>
            <div className="doc-alv-row">
              <span className="doc-alv-label">ALV {vatRate} %</span>
              <span className="doc-alv-val">{fmt(vatAmount)} €</span>
            </div>
            <div className="doc-alv-row doc-alv-total-row">
              <span className="doc-amount-label">Yhteensä</span>
              <span className="doc-amount">{fmt(template.amount)} €</span>
            </div>
          </div>
        ) : (
          <>
            <span className="doc-amount-label">Summa</span>
            <span className="doc-amount">{fmt(template.amount)} €</span>
          </>
        )}
      </div>
    </div>
  );
}
