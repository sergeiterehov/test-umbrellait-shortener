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
     * Enable state of functional
     */
    shortButtonEnabled: boolean;
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
            shortButtonEnabled: true,
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
                    disabled={! this.state.shortButtonEnabled}
                    placeholder="Enter your long link here..." />
                <small>{ this.state.error }</small>
            </div>

            <div className="mb-3">
                <button className="btn btn-success"
                    onClick={this.handlerShortButtonClick}
                    disabled={! this.state.shortButtonEnabled}>Short it!</button>

                { this.renderShortLink() }
            </div>
        </div>;
    }

    /**
     * View for result: short link
     */
    private renderShortLink() {
        if (! this.state.shortLabel) {
            return;
        }

        return <span className="pl-3">
            Your short link: <a href={this.state.shortLabel}>{ this.state.shortLabel }</a>
        </span>;
    }

    /**
     * On click button create short link
     */
    private handlerShortButtonClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        this.setState({
            shortButtonEnabled: false,
            error: undefined,
            shortLabel: undefined,
        });

        const url = this.state.sourceUrl;

        try {
            validateUrl(url);

            const short = await this.createShortLink(url);

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
            shortButtonEnabled: true,
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
     * Create short link request
     * @param url Source URL
     */
    private async createShortLink(url: string) {
        let result: ApiResultShortCreate;

        try {
            result = await api.shortCreate(url);
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
