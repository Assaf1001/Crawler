import React, { useEffect, useState } from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Node = ({ node }) => {
    const [paddingUnit, setPaddingUnit] = useState("");

    useEffect(() => {
        setPaddingUnit(node.depth * 30 + "px");
    }, [node.depth]);

    return (
        <Accordion style={{ paddingLeft: paddingUnit }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h2>{node.title}</h2>
            </AccordionSummary>
            <div>
                <h3>URL: {node.url}</h3>
                <h3>Depth: {node.depth}</h3>
                <h3>Address: {node.address}</h3>
                <h3>Links:</h3>
                {node.links.length === 0 ? (
                    <p>No likns</p>
                ) : (
                    <div>
                        {node.links.map((link, i) => (
                            <a key={i} href={link}>
                                {link}
                            </a>
                        ))}
                    </div>
                )}
                <h4>Children:</h4>
                {node.children.length === 0 ? (
                    <p>No children</p>
                ) : (
                    <div>
                        {node.children.map((childNode, i) => (
                            <Node key={i} node={childNode} />
                        ))}
                    </div>
                )}
            </div>
        </Accordion>
    );
};

export default Node;
