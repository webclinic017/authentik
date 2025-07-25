import "#elements/chips/Chip";
import "#elements/chips/ChipGroup";
import "#elements/forms/DeleteBulkForm";

import { DEFAULT_CONFIG } from "#common/api/config";
import { formatElapsedTime } from "#common/temporal";

import { PaginatedResponse, Table, TableColumn } from "#elements/table/Table";

import { CoreApi, UserConsent } from "@goauthentik/api";

import { msg } from "@lit/localize";
import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("ak-user-consent-list")
export class UserConsentList extends Table<UserConsent> {
    @property({ type: Number })
    userId?: number;

    async apiEndpoint(): Promise<PaginatedResponse<UserConsent>> {
        return new CoreApi(DEFAULT_CONFIG).coreUserConsentList({
            ...(await this.defaultEndpointConfig()),
            user: this.userId,
        });
    }

    checkbox = true;
    clearOnRefresh = true;
    order = "-expires";

    columns(): TableColumn[] {
        return [
            new TableColumn(msg("Application"), "application"),
            new TableColumn(msg("Expires"), "expires"),
            new TableColumn(msg("Permissions"), "permissions"),
        ];
    }

    renderToolbarSelected(): TemplateResult {
        const disabled = this.selectedElements.length < 1;
        return html`<ak-forms-delete-bulk
            objectLabel=${msg("Consent(s)")}
            .objects=${this.selectedElements}
            .usedBy=${(item: UserConsent) => {
                return new CoreApi(DEFAULT_CONFIG).coreUserConsentUsedByList({
                    id: item.pk,
                });
            }}
            .delete=${(item: UserConsent) => {
                return new CoreApi(DEFAULT_CONFIG).coreUserConsentDestroy({
                    id: item.pk,
                });
            }}
        >
            <button ?disabled=${disabled} slot="trigger" class="pf-c-button pf-m-danger">
                ${msg("Delete")}
            </button>
        </ak-forms-delete-bulk>`;
    }

    row(item: UserConsent): TemplateResult[] {
        return [
            html`${item.application.name}`,
            html`${item.expires && item.expiring
                ? html`<div>${formatElapsedTime(item.expires)}</div>
                      <small>${item.expires.toLocaleString()}</small>`
                : msg("-")}`,
            html`${item.permissions
                ? html`<ak-chip-group>
                      ${item.permissions.split(" ").map((perm) => {
                          return html`<ak-chip .removable=${false}>${perm}</ak-chip>`;
                      })}
                  </ak-chip-group>`
                : html`-`}`,
        ];
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-user-consent-list": UserConsentList;
    }
}
