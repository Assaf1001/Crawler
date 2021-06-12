import React from "react";

const ResultPage = ({ page }) => {
    return (
        <div>
            <h3>Title: {page.title}</h3>
            <h4>Depth: {page.depth}</h4>
            <h5>URL: {page.url}</h5>
            <h6>Links:</h6>
            <div>
                {page.links.map((link, i) => (
                    <a key={i} href={link}>
                        {link}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default ResultPage;
