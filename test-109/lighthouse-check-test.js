const { lighthouseCheck } = require('../dist');

(async () => {
  await lighthouseCheck({
    device: 'desktop',
    maxRetries: 5,
    urls: [
      'http://localhost:8080/modern/',
      'http://localhost:8080/modern/blog-home.html',
      'http://localhost:8080/modern/blog-post.html',
      'http://localhost:8080/modern/contact.html',
      'http://localhost:8080/modern/portfolio-item.html',
      'http://localhost:8080/modern/portfolio-overview.html',
      'http://localhost:8080/modern/pricing.html',
      'http://localhost:8080/modern/faq.html',
      'http://localhost:8080/freelancer/',
      'http://localhost:8080/portfolio/',
      'http://localhost:8080/shop/',
    ],
  });
})();
