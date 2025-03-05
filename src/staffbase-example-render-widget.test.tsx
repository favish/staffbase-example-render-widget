import React from "react"
import {screen, render} from "@testing-library/react"

import {StaffbaseExampleRenderWidget} from "./staffbase-example-render-widget";

describe("StaffbaseExampleRenderWidget", () => {
    it("should render the component", () => {
        render(<StaffbaseExampleRenderWidget contentLanguage="en_US" message="World"/>);

        expect(screen.getByText(/Hello World/)).toBeInTheDocument();
    })
})
