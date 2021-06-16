import React from "react";

const Node = ({ node }) => {
    return (
        <div>
            <h2>Title: {node.title}</h2>
            <h4>URL: {node.url}</h4>
            <h3>Depth: {node.depth}</h3>
            <h3>Address: {node.address}</h3>
            <h5>Links:</h5>
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
            <h6>Children:</h6>
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
    );
};

export default Node;
