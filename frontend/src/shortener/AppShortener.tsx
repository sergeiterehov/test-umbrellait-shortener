import * as React from "react";
import { TopLinks } from "./TopLinks";
import { CreateShortLink } from "./CreateShortLink";

export class AppShortener extends React.Component {
    public render() {
        return <div className="row">
            <div className="col-md-4 order-md-2 mb-4">
                <h4 className="mb-3 text-muted">
                    Top links
                </h4>
                <div className="mb-3">
                    <TopLinks />
                </div>
            </div>

            <div className="col-md-8 order-md-1">
                <h4 className="mb-3">
                    Create short link
                </h4>
                <div className="mb-3">
                    <CreateShortLink />
                </div>
            </div>
        </div>;
    }
}
