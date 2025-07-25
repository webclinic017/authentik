import { PFSize } from "#common/enums";

import { AKElement } from "#elements/Base";
import { ModalHideEvent, ModalShowEvent } from "#elements/controllers/ModalOrchestrationController";
import { Form } from "#elements/forms/Form";

import { msg } from "@lit/localize";
import { css, CSSResult, html, nothing, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import PFBackdrop from "@patternfly/patternfly/components/Backdrop/backdrop.css";
import PFButton from "@patternfly/patternfly/components/Button/button.css";
import PFCard from "@patternfly/patternfly/components/Card/card.css";
import PFContent from "@patternfly/patternfly/components/Content/content.css";
import PFForm from "@patternfly/patternfly/components/Form/form.css";
import PFFormControl from "@patternfly/patternfly/components/FormControl/form-control.css";
import PFModalBox from "@patternfly/patternfly/components/ModalBox/modal-box.css";
import PFPage from "@patternfly/patternfly/components/Page/page.css";
import PFTitle from "@patternfly/patternfly/components/Title/title.css";
import PFBullseye from "@patternfly/patternfly/layouts/Bullseye/bullseye.css";
import PFBase from "@patternfly/patternfly/patternfly-base.css";

export const MODAL_BUTTON_STYLES = css`
    :host {
        text-align: left;
        font-size: var(--pf-global--FontSize--md);
    }
    .pf-c-modal-box > .pf-c-button + * {
        margin-right: 0;
    }
    /* fix multiple selects height */
    select[multiple] {
        height: 15em;
    }
`;

@customElement("ak-modal-button")
export class ModalButton extends AKElement {
    //#region Properties

    @property()
    size: PFSize = PFSize.Large;

    @property({ type: Boolean })
    open = false;

    @property({ type: Boolean })
    locked = false;

    //#endregion

    handlerBound = false;

    static styles: CSSResult[] = [
        PFBase,
        PFButton,
        PFModalBox,
        PFForm,
        PFTitle,
        PFFormControl,
        PFBullseye,
        PFBackdrop,
        PFPage,
        PFCard,
        PFContent,
        MODAL_BUTTON_STYLES,
        css`
            .locked {
                overflow-y: hidden !important;
            }
            .pf-c-modal-box.pf-m-xl {
                --pf-c-modal-box--Width: calc(1.5 * var(--pf-c-modal-box--m-lg--lg--MaxWidth));
            }
        `,
    ];

    closeModal() {
        this.resetForms();
        this.open = false;
    }

    resetForms(): void {
        for (const form of this.querySelectorAll<Form | HTMLFormElement>("[slot=form]")) {
            form.reset?.();
        }
    }

    onClick(): void {
        this.open = true;
        this.dispatchEvent(new ModalShowEvent(this));
        this.querySelectorAll("*").forEach((child) => {
            if ("requestUpdate" in child) {
                (child as AKElement).requestUpdate();
            }
        });
    }

    //#region Render

    renderModalInner(): TemplateResult | typeof nothing {
        return html`<slot name="modal"></slot>`;
    }

    renderModal(): TemplateResult {
        return html`<div
            class="pf-c-backdrop"
            @click=${(e: PointerEvent) => {
                e.stopPropagation();
            }}
        >
            <div class="pf-l-bullseye">
                <div
                    class="pf-c-modal-box ${this.size} ${this.locked ? "locked" : ""}"
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        @click=${() => {
                            this.dispatchEvent(new ModalHideEvent(this));
                        }}
                        class="pf-c-button pf-m-plain"
                        type="button"
                        aria-label=${msg("Close dialog")}
                    >
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                    ${this.renderModalInner()}
                </div>
            </div>
        </div>`;
    }

    render(): TemplateResult {
        return html` <slot name="trigger" @click=${() => this.onClick()}></slot>
            ${this.open ? this.renderModal() : nothing}`;
    }

    //#endregion
}

declare global {
    interface HTMLElementTagNameMap {
        "ak-modal-button": ModalButton;
    }
}
