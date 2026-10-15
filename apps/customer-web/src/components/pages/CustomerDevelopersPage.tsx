"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ExternalLink,
  KeyRound,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { useCustomer } from "@/mock/CustomerContext";

interface CustomerDevelopersPageProps {
  initialSubPage?: string;
}

type DeveloperTab =
  | "overview"
  | "keys"
  | "webhooks"
  | "events"
  | "logs"
  | "more"
  | "docs"
  | "reference"
  | "sdks"
  | "cli"
  | "apps"
  | "settings";

const mapTab = (page: string): DeveloperTab => {
  if (page.includes("key")) return "keys";
  if (page.includes("webhook")) return "webhooks";
  if (page.includes("event")) return "events";
  if (page.includes("log")) return "logs";
  if (page.includes("reference")) return "reference";
  if (page.includes("sdk")) return "sdks";
  if (page.includes("cli")) return "cli";
  if (page.includes("app")) return "apps";
  if (page.includes("setting")) return "settings";
  if (page.includes("more")) return "more";
  if (page.includes("doc")) return "docs";
  return "overview";
};

const tabLabels: Array<{ id: DeveloperTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "keys", label: "API keys" },
  { id: "webhooks", label: "Webhooks" },
  { id: "events", label: "Events" },
  { id: "logs", label: "Events & logs" },
  { id: "docs", label: "Documentation" },
];

export const CustomerDevelopersPage: React.FC<CustomerDevelopersPageProps> = ({
  initialSubPage = "overview",
}) => {
  const { user } = useCustomer();
  const [activeTab, setActiveTab] = useState<DeveloperTab>(() =>
    mapTab(initialSubPage),
  );
  const apiUrl = process.env.NEXT_PUBLIC_MONEYFLOW_API_URL || "Not configured";

  return (
    <section className="mf-page">
      <div className="mf-breadcrumb">Settings</div>
      <div className="mf-page-title-row">
        <div>
          <h1>Developers</h1>
          <p>Configure how your organisation connects to E‑NAKO MoneyFlow.</p>
        </div>
        <span className="mf-status">Sandbox</span>
      </div>

      <nav className="mf-tabs" aria-label="Developer sections">
        {tabLabels.map((tab) => (
          <button
            className={activeTab === tab.id ? "is-active" : ""}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "overview" && (
        <div className="mf-section-stack">
          <section>
            <h2>API policies</h2>
            <p className="mf-section-copy">
              Policies define the controls that apply to requests made through
              your organisation’s API credentials.
            </p>
            <div className="mf-table-wrap">
              <table className="mf-table">
                <thead>
                  <tr>
                    <th>Policy</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="mf-strong">Customer API access</td>
                    <td>
                      API access is requested and reviewed before keys are
                      issued.
                    </td>
                    <td>
                      <span className="mf-muted">Not enabled</span>
                    </td>
                    <td>
                      <button className="mf-link" type="button">
                        Request access
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2>API keys</h2>
            <p className="mf-section-copy">
              API keys authenticate requests to E‑NAKO MoneyFlow. Secret keys
              are shown once and must remain on your server.
            </p>
            <EmptyRow
              icon={<KeyRound />}
              title="No API keys have been issued"
              description="Request access to create a live or sandbox integration."
            />
          </section>
        </div>
      )}

      {activeTab === "keys" && (
        <div className="mf-section-stack">
          <section>
            <div className="mf-section-heading">
              <div>
                <h2>API keys</h2>
                <p className="mf-section-copy">
                  Create, rotate and revoke keys for your own MoneyFlow
                  integration.
                </p>
              </div>
              <button className="mf-button" type="button">
                Request access
              </button>
            </div>
            <EmptyRow
              icon={<KeyRound />}
              title="No credentials available"
              description="Keys will appear here after API access has been approved."
            />
          </section>
          <section className="mf-notice">
            <ShieldCheck className="h-4 w-4" />
            <p>
              <strong>Protect your secret key.</strong> It must never be
              included in browser code, a mobile application, an email, or a
              source-code repository.
            </p>
          </section>
        </div>
      )}

      {activeTab === "webhooks" && (
        <div className="mf-section-stack">
          <section>
            <div className="mf-section-heading">
              <div>
                <h2>Webhook endpoints</h2>
                <p className="mf-section-copy">
                  Receive signed notifications about events relating to your
                  organisation.
                </p>
              </div>
              <button className="mf-button" type="button">
                Add endpoint
              </button>
            </div>
            <EmptyRow
              icon={<Radio />}
              title="No webhook endpoints"
              description="Endpoints will be listed here after they are registered and verified."
            />
          </section>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="mf-section-stack">
          <section>
            <h2>Events & request logs</h2>
            <p className="mf-section-copy">
              Monitor only your organisation’s integration events and API
              requests.
            </p>
            <EmptyRow
              icon={<Radio />}
              title="No activity to show"
              description="Request delivery and API events will appear after an integration is active."
            />
          </section>
        </div>
      )}

      {activeTab === "docs" && (
        <div className="mf-section-stack">
          <section>
            <h2>Developer documentation</h2>
            <p className="mf-section-copy">
              The developer portal will publish the E‑NAKO API contract,
              authentication requirements, idempotency rules and webhook
              verification guide.
            </p>
            <div className="mf-doc-list">
              <DocRow
                icon={<BookOpen />}
                label="API reference"
                detail={`Base URL: ${apiUrl}`}
              />
              <DocRow
                icon={<ShieldCheck />}
                label="Authentication and key safety"
                detail="How to store and rotate credentials safely."
              />
              <DocRow
                icon={<Radio />}
                label="Webhook verification"
                detail="How to verify signed event deliveries."
              />
            </div>
          </section>
          <section className="mf-notice">
            <ExternalLink className="h-4 w-4" />
            <p>
              Need an integration enabled? Contact us from the Support section
              using <strong>{user.email || "your verified account"}</strong>.
            </p>
          </section>
        </div>
      )}

      {activeTab === "events" && (
        <DeveloperEmpty
          title="No events yet"
          description="Payment and account events will appear here once your integration is configured."
          icon={<Radio />}
        />
      )}
      {activeTab === "more" && (
        <DeveloperEmpty
          title="Additional developer tools"
          description="Version management, idempotency controls and test data tools will appear here as the API platform is enabled."
          icon={<ShieldCheck />}
        />
      )}
      {activeTab === "reference" && (
        <DeveloperEmpty
          title="API reference"
          description="The E‑NAKO MoneyFlow OpenAPI reference will be published here with live request and response schemas."
          icon={<BookOpen />}
        />
      )}
      {activeTab === "sdks" && (
        <DeveloperEmpty
          title="SDKs"
          description="Official JavaScript, mobile and server SDKs will be published when customer API access is available."
          icon={<BookOpen />}
        />
      )}
      {activeTab === "cli" && (
        <DeveloperEmpty
          title="Command-line interface"
          description="The E‑NAKO CLI will support local testing and operational diagnostics for approved integrators."
          icon={<BookOpen />}
        />
      )}
      {activeTab === "apps" && (
        <DeveloperEmpty
          title="No created apps"
          description="Applications registered to your organisation will be managed here."
          icon={<KeyRound />}
        />
      )}
      {activeTab === "settings" && (
        <DeveloperEmpty
          title="Developer settings"
          description="Configure your organisation’s developer notifications and integration defaults here."
          icon={<ShieldCheck />}
        />
      )}
    </section>
  );
};

const EmptyRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="mf-empty-row">
    <span className="mf-empty-icon">{icon}</span>
    <div>
      <p className="mf-strong">{title}</p>
      <p>{description}</p>
    </div>
  </div>
);

const DocRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  detail: string;
}> = ({ icon, label, detail }) => (
  <div className="mf-doc-row">
    <span>{icon}</span>
    <div>
      <p className="mf-strong">{label}</p>
      <p>{detail}</p>
    </div>
    <ExternalLink className="h-4 w-4 text-slate-400" />
  </div>
);

const DeveloperEmpty: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ title, description, icon }) => (
  <div className="mf-section-stack">
    <section>
      <h2>{title}</h2>
      <p className="mf-section-copy">{description}</p>
      <EmptyRow icon={icon} title={title} description={description} />
    </section>
  </div>
);
