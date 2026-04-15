export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Our Store</h1>
        
        <div className="prose prose-lg">
          <p className="text-gray-600 mb-6">
            Welcome to our online store! We're passionate about providing high-quality products 
            at affordable prices with exceptional customer service.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To make online shopping accessible, convenient, and enjoyable for everyone. 
                We carefully curate our product selection to ensure quality and value.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Customer satisfaction first</li>
                <li>• Quality products at fair prices</li>
                <li>• Fast and reliable shipping</li>
                <li>• Secure shopping experience</li>
              </ul>
            </div>
          </div>

          <div className="bg-primary-50 p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Secure Shopping</h4>
                <p className="text-gray-600">
                  Your security is our priority. We use industry-standard encryption 
                  and secure payment processing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Fast Delivery</h4>
                <p className="text-gray-600">
                  Most orders ship within 24 hours and arrive at your doorstep 
                  in 2-3 business days.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Easy Returns</h4>
                <p className="text-gray-600">
                  Not satisfied? We offer a 30-day return policy with no questions asked.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">24/7 Support</h4>
                <p className="text-gray-600">
                  Our customer support team is available around the clock 
                  to assist you with any questions.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Shop?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied customers who trust us for their shopping needs.
            </p>
            <a
              href="/register"
              className="inline-block px-8 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700"
            >
              Create Your Account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}