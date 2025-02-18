let options = {};

if (process.env.NODE_ENV === 'development') {
    options = {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                baseUri: ["'self'"],
                blockAllMixedContent: [],
                fontSrc: ["'self'", "https:", "data:"],
                frameAncestors: ["'self'"],
                imgSrc: ["'self'", "data:", "https://user-images.githubusercontent.com", "https://cdn.pixabay.com"],
                objectSrc: ["'none'"],
                scriptSrc: ["'self'", "'nonce-browser-sync'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
                scriptSrcAttr: ["'none'"],
                styleSrc: ["'self'", "https:", "'unsafe-inline'"],
                upgradeInsecureRequests: []
            }
        }
    }
}

export default options;
