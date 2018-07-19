import * as React from "react";
import { api } from "./API";
import { ErrorData } from "./errors/ErrorData";
import { ApiResultShortCreate } from "./types/api";
import { validateUrl } from "./helper/validators";
import { buildShortUrl } from "./helper/link";

interface IStateCreateShortLink {
    /**
     * URL input content
     */
    sourceUrl: string;
    /**
     * Name input content
     */
    personalName: string;
    /**
     * Enabled functional
     */
    shortEnabled: boolean;
    /**
     * Enabled personal name using
     */
    personalNameEnabled: boolean;
    /**
     * Message in the short preview label
     */
    shortLabel?: string;
    /**
     * Error string
     */
    error?: string;
}

/**
 * Block with then main functional for creation short links
 */
export class CreateShortLink extends React.Component<{}, IStateCreateShortLink> {
    constructor(props) {
        super(props);

        this.state = {
            sourceUrl: "",
            personalName: "",
            shortEnabled: true,
            personalNameEnabled: false,
            shortLabel: undefined,
            error: undefined,
        };
    }

    public render() {
        return <div>
            <div className="mb-3">
                <label htmlFor="source-link-input">Long url</label>
                <input type="text"
                    className="form-control"
                    id="source-link-input"
                    value={this.state.sourceUrl}
                    onChange={this.handlerSourceLinkChange}
                    disabled={! this.state.shortEnabled}
                    placeholder="Enter your long link here..." />
            </div>

            { this.renderPersonalNameInput() }

            <div className="mb-3">
                <button className="btn btn-success"
                    onClick={this.handlerShortButtonClick}
                    disabled={! this.state.shortEnabled}>Short it!</button>

                { this.renderShortLink() }
            </div>
        </div>;
    }

    /**
     * View for result: short link or error
     */
    private renderShortLink() {
        if (this.state.error) {
            return <span className="pl-3 text-danger">
                { this.state.error }
            </span>;
        }

        if (! this.state.shortLabel) {
            return;
        }

        return <span className="pl-3">
            Your short link: <a href={this.state.shortLabel}>{ this.state.shortLabel }</a>
        </span>;
    }

    private renderPersonalNameInput() {
        if (! this.state.personalNameEnabled) {
            return <div className="mb-3">
                <a href="#" onClick={this.handlerNameEnableClick}>Use personal name</a>
            </div>;
        }

        return <div className="mb-3">
            <label htmlFor="source-link-input">Personal name</label>
            <input type="text"
                className="form-control"
                id="source-link-input"
                value={this.state.personalName}
                onChange={this.handlerPersonalNameChange}
                disabled={! this.state.shortEnabled}
                placeholder="If not required, leave empty" />
        </div>;
    }

    /**
     * On click button create short link
     */
    private handlerShortButtonClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        this.setState({
            shortEnabled: false,
            error: undefined,
            shortLabel: undefined,
        });

        const url = this.state.sourceUrl;
        const name = this.state.personalName;

        try {
            validateUrl(url);

            const short = await this.createShortLink(url, name ? name : undefined);

            this.setState({
                shortLabel: buildShortUrl(short),
            });
        } catch (e) {
            if (e instanceof Error) {
                this.setState({
                    error: e.message,
                });
            }
        }

        this.setState({
            shortEnabled: true,
        });
    }

    /**
     * On change source link
     */
    private handlerSourceLinkChange = async (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            sourceUrl: e.currentTarget.value,
            error: undefined,
            shortLabel: undefined,
        });
    }

    /**
     * On change personal name
     */
    private handlerPersonalNameChange = async (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            personalName: e.currentTarget.value,
            error: undefined,
            shortLabel: undefined,
        });
    }

    /**
     * On click use personal name
     */
    private handlerNameEnableClick = async (e: React.FormEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        this.setState({
            personalNameEnabled: true,
        });
    }

    /**
     * Create short link request
     * @param url Source URL
     */
    private async createShortLink(url: string, name?: string) {
        let result: ApiResultShortCreate;

        try {
            result = await api.shortCreate(url, name);
        } catch (e) {
            if (e instanceof ErrorData) {
                throw new Error(e.errors.map((item) => item.msg).join("; "));
            } else {
                throw e;
            }
        }

        return result.short;
    }
}
