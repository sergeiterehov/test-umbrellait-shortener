import * as React from "react";

export class CreateShortLink extends React.Component {
    public render() {
        return <div>
            <div className="mb-3">
                <label htmlFor="source-link-input">Long url</label>
                <input type="text"
                    id="source-link-input"
                    placeholder="Enter your long link here..."
                    className="form-control" />
            </div>

            <div className="mb-3">
                <button className="btn btn-success">Short it!</button>
            </div>
        </div>;
    }
}
