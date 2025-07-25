import "#admin/policies/BoundPoliciesList";
import "#admin/rbac/ObjectPermissionsPage";
import "#admin/sources/oauth/OAuthSourceDiagram";
import "#admin/sources/oauth/OAuthSourceForm";
import "#components/events/ObjectChangelog";
import "#elements/CodeMirror";
import "#elements/Tabs";
import "#elements/buttons/SpinnerButton/index";
import "#elements/forms/ModalForm";

import { DEFAULT_CONFIG } from "#common/api/config";
import { EVENT_REFRESH } from "#common/constants";

import { AKElement } from "#elements/Base";

import { sourceBindingTypeNotices } from "#admin/sources/utils";

import {
    OAuthSource,
    ProviderTypeEnum,
    RbacPermissionsAssignedByUsersListModelEnum,
    SourcesApi,
} from "@goauthentik/api";

import { msg } from "@lit/localize";
import { CSSResult, html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import PFButton from "@patternfly/patternfly/components/Button/button.css";
import PFCard from "@patternfly/patternfly/components/Card/card.css";
import PFContent from "@patternfly/patternfly/components/Content/content.css";
import PFDescriptionList from "@patternfly/patternfly/components/DescriptionList/description-list.css";
import PFPage from "@patternfly/patternfly/components/Page/page.css";
import PFGrid from "@patternfly/patternfly/layouts/Grid/grid.css";
import PFBase from "@patternfly/patternfly/patternfly-base.css";

export function ProviderToLabel(provider?: ProviderTypeEnum): string {
    switch (provider) {
        case undefined:
            return "";
        case ProviderTypeEnum.Apple:
            return "Apple";
        case ProviderTypeEnum.Azuread:
            return "Azure Active Directory";
        case ProviderTypeEnum.Discord:
            return "Discord";
        case ProviderTypeEnum.Facebook:
            return "Facebook";
        case ProviderTypeEnum.Github:
            return "GitHub";
        case ProviderTypeEnum.Gitlab:
            return "GitLab";
        case ProviderTypeEnum.Google:
            return "Google";
        case ProviderTypeEnum.Mailcow:
            return "Mailcow";
        case ProviderTypeEnum.Openidconnect:
            return msg("Generic OpenID Connect");
        case ProviderTypeEnum.Okta:
            return "Okta";
        case ProviderTypeEnum.Patreon:
            return "Patreon";
        case ProviderTypeEnum.Reddit:
            return "Reddit";
        case ProviderTypeEnum.Twitter:
            return "Twitter";
        case ProviderTypeEnum.Twitch:
            return "Twitch";
        case ProviderTypeEnum.UnknownDefaultOpenApi:
            return msg("Unknown provider type");
    }
}

@customElement("ak-source-oauth-view")
export class OAuthSourceViewPage extends AKElement {
    @property({ type: String })
    set sourceSlug(value: string) {
        new SourcesApi(DEFAULT_CONFIG)
            .sourcesOauthRetrieve({
                slug: value,
            })
            .then((source) => {
                this.source = source;
            });
    }

    @property({ attribute: false })
    source?: OAuthSource;

    static styles: CSSResult[] = [
        PFBase,
        PFPage,
        PFButton,
        PFGrid,
        PFContent,
        PFCard,
        PFDescriptionList,
    ];

    constructor() {
        super();
        this.addEventListener(EVENT_REFRESH, () => {
            if (!this.source?.pk) return;
            this.sourceSlug = this.source?.slug;
        });
    }

    render(): TemplateResult {
        if (!this.source) {
            return html``;
        }
        return html`<ak-tabs>
            <section
                slot="page-overview"
                data-tab-title="${msg("Overview")}"
                class="pf-c-page__main-section pf-m-no-padding-mobile"
            >
                <div class="pf-l-grid pf-m-gutter">
                    <div class="pf-c-card pf-l-grid__item pf-m-12-col">
                        <div class="pf-c-card__title">${msg("Details")}</div>
                        <div class="pf-c-card__body">
                            <dl class="pf-c-description-list pf-m-2-col-on-lg">
                                <div class="pf-c-description-list__group">
                                    <dt class="pf-c-description-list__term">
                                        <span class="pf-c-description-list__text"
                                            >${msg("Name")}</span
                                        >
                                    </dt>
                                    <dd class="pf-c-description-list__description">
                                        <div class="pf-c-description-list__text">
                                            ${this.source.name}
                                        </div>
                                    </dd>
                                </div>
                                <div class="pf-c-description-list__group">
                                    <dt class="pf-c-description-list__term">
                                        <span class="pf-c-description-list__text"
                                            >${msg("Provider Type")}</span
                                        >
                                    </dt>
                                    <dd class="pf-c-description-list__description">
                                        <div class="pf-c-description-list__text">
                                            ${ProviderToLabel(this.source.providerType)}
                                        </div>
                                    </dd>
                                </div>
                                <div class="pf-c-description-list__group">
                                    <dt class="pf-c-description-list__term">
                                        <span class="pf-c-description-list__text"
                                            >${msg("Callback URL")}</span
                                        >
                                    </dt>
                                    <dd class="pf-c-description-list__description">
                                        <code class="pf-c-description-list__text"
                                            >${this.source.callbackUrl}</code
                                        >
                                    </dd>
                                </div>
                                <div class="pf-c-description-list__group">
                                    <dt class="pf-c-description-list__term">
                                        <span class="pf-c-description-list__text"
                                            >${msg("Access Key")}</span
                                        >
                                    </dt>
                                    <dd class="pf-c-description-list__description">
                                        <div class="pf-c-description-list__text">
                                            ${this.source.consumerKey}
                                        </div>
                                    </dd>
                                </div>
                                <div class="pf-c-description-list__group">
                                    <dt class="pf-c-description-list__term">
                                        <span class="pf-c-description-list__text"
                                            >${msg("Authorization URL")}</span
                                        >
                                    </dt>
                                    <dd class="pf-c-description-list__description">
                                        <div class="pf-c-description-list__text">
                                            ${this.source.type?.authorizationUrl ||
                                            this.source.authorizationUrl}
                                        </div>
                                    </dd>
                                </div>
                                <div class="pf-c-description-list__group">
                                    <dt class="pf-c-description-list__term">
                                        <span class="pf-c-description-list__text"
                                            >${msg("Token URL")}</span
                                        >
                                    </dt>
                                    <dd class="pf-c-description-list__description">
                                        <div class="pf-c-description-list__text">
                                            ${this.source.type?.accessTokenUrl ||
                                            this.source.accessTokenUrl}
                                        </div>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <div class="pf-c-card__footer">
                            <ak-forms-modal>
                                <span slot="submit"> ${msg("Update")} </span>
                                <span slot="header"> ${msg("Update OAuth Source")} </span>
                                <ak-source-oauth-form slot="form" .instancePk=${this.source.slug}>
                                </ak-source-oauth-form>
                                <button slot="trigger" class="pf-c-button pf-m-primary">
                                    ${msg("Edit")}
                                </button>
                            </ak-forms-modal>
                        </div>
                    </div>
                    <div class="pf-c-card pf-l-grid__item pf-m-12-col">
                        <div class="pf-c-card__title">${msg("Diagram")}</div>
                        <div class="pf-c-card__body">
                            <ak-source-oauth-diagram
                                .source=${this.source}
                            ></ak-source-oauth-diagram>
                        </div>
                    </div>
                </div>
            </section>
            <section
                slot="page-changelog"
                data-tab-title="${msg("Changelog")}"
                class="pf-c-page__main-section pf-m-no-padding-mobile"
            >
                <div class="pf-l-grid pf-m-gutter">
                    <div class="pf-c-card pf-l-grid__item pf-m-12-col">
                        <div class="pf-c-card__body">
                            <ak-object-changelog
                                targetModelPk=${this.source.pk || ""}
                                targetModelApp="authentik_sources_oauth"
                                targetModelName="oauthsource"
                            >
                            </ak-object-changelog>
                        </div>
                    </div>
                </div>
            </section>
            <div
                slot="page-policy-binding"
                data-tab-title="${msg("Policy Bindings")}"
                class="pf-c-page__main-section pf-m-no-padding-mobile"
            >
                <div class="pf-l-grid pf-m-gutter">
                    <div class="pf-c-card pf-l-grid__item pf-m-12-col">
                        <div class="pf-c-card__title">
                            ${msg(
                                `These bindings control which users can access this source.
            You can only use policies here as access is checked before the user is authenticated.`,
                            )}
                        </div>
                        <div class="pf-c-card__body">
                            <ak-bound-policies-list
                                .target=${this.source.pk}
                                .typeNotices=${sourceBindingTypeNotices()}
                                .policyEngineMode=${this.source.policyEngineMode}
                            >
                            </ak-bound-policies-list>
                        </div>
                    </div>
                </div>
            </div>
            <ak-rbac-object-permission-page
                slot="page-permissions"
                data-tab-title="${msg("Permissions")}"
                model=${RbacPermissionsAssignedByUsersListModelEnum.AuthentikSourcesOauthOauthsource}
                objectPk=${this.source.pk}
            ></ak-rbac-object-permission-page>
        </ak-tabs>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-source-oauth-view": OAuthSourceViewPage;
    }
}
