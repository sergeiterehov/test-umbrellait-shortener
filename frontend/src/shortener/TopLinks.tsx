import * as React from "react";
import { ApiResultShortMostPopular } from "./types/api";
import { buildShortUrl } from "./helper/link";
import { api } from "./API";

interface IStateTopLinks {
    /**
     * Information message
     */
    info: string;
    /**
     * Links ot popular links
     */
    list?: ApiResultShortMostPopular;
}

const renderLink = (id: string, views: number, preview: string) => (
    <div className="list-group-item d-flex justify-content-between lh-condensed">
        <div>
            <div>
                <a href={buildShortUrl(id)}>{ id }</a>
            </div>
            <small className="text-muted">{ preview }</small>
        </div>
        <h4 className="text-muted">{ views }</h4>
    </div>
);

/**
 * Most popular links
 */
export class TopLinks extends React.Component<{}, IStateTopLinks> {
    constructor(props) {
        super(props);

        this.state = {
            info: "Not available, yet...",
            list: undefined,
        };
    }

    public render() {
        if (! this.state.list) {
            return <small className="text-muted">{ this.state.info }</small>;
        }

        return <div>
            { this.renderList() }
        </div>;
    }

    public async componentWillMount() {
        try {
            const links = await api.shortMostPopular();

            this.setState({
                list: links,
            });
        } catch (e) {
            this.setState({
                info: "Error!",
            });
        }
    }

    /**
     * Renders link of links
     */
    private renderList() {
        return <ul className="list-group mb-3">
            { this.state.list.map((link) => renderLink(link.link, link.views, link.preview)) }
        </ul>;
    }
}
