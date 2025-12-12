-- Insert admin user
INSERT INTO admin_users (email, name, role) VALUES 
('rohitsengar02@gmail.com', 'Rohit Sengar', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample users
INSERT INTO users (name, email, phone, location, status) VALUES 
('John Doe', 'john.doe@example.com', '+1-555-0123', 'New York, USA', 'active'),
('Jane Smith', 'jane.smith@example.com', '+1-555-0124', 'Los Angeles, USA', 'active'),
('Mike Johnson', 'mike.johnson@example.com', '+1-555-0125', 'Chicago, USA', 'pending'),
('Sarah Wilson', 'sarah.wilson@example.com', '+1-555-0126', 'Miami, USA', 'active'),
('David Brown', 'david.brown@example.com', '+1-555-0127', 'Seattle, USA', 'inactive')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, description, client_name, client_email, status, priority, budget, start_date, end_date, progress, category) VALUES 
('E-commerce Platform', 'Modern e-commerce solution with AI recommendations', 'TechCorp Inc', 'contact@techcorp.com', 'in_progress', 'high', 50000.00, '2024-01-15', '2024-06-15', 65, 'Web Development'),
('Mobile Banking App', 'Secure mobile banking application with biometric auth', 'FinanceBank', 'dev@financebank.com', 'planning', 'high', 75000.00, '2024-02-01', '2024-08-01', 15, 'Mobile Development'),
('AI Chatbot Integration', 'Customer service chatbot with natural language processing', 'ServicePro', 'tech@servicepro.com', 'completed', 'medium', 25000.00, '2023-10-01', '2024-01-01', 100, 'AI Integration'),
('Corporate Website', 'Professional corporate website with CMS', 'BusinessLtd', 'info@businessltd.com', 'in_progress', 'medium', 15000.00, '2024-01-20', '2024-04-20', 80, 'Web Development'),
('Data Analytics Dashboard', 'Real-time analytics dashboard for business intelligence', 'DataCorp', 'analytics@datacorp.com', 'on_hold', 'low', 35000.00, '2024-03-01', '2024-07-01', 30, 'Data Analytics');

-- Insert sample services
INSERT INTO services (title, description, features, technologies, price_starting, category, icon, gradient) VALUES 
('Web Development', 'Custom web applications with modern frameworks', 
 ARRAY['Responsive Design', 'SEO Optimization', 'Performance Optimization', 'Security Implementation'], 
 ARRAY['React', 'Next.js', 'TypeScript', 'Tailwind CSS'], 
 5000.00, 'Development', 'Code', 'from-blue-500 to-purple-600'),
 
('Mobile App Development', 'Native and cross-platform mobile applications', 
 ARRAY['iOS Development', 'Android Development', 'Cross-platform', 'App Store Deployment'], 
 ARRAY['React Native', 'Flutter', 'Swift', 'Kotlin'], 
 8000.00, 'Development', 'Smartphone', 'from-green-500 to-blue-500'),
 
('AI Integration', 'Artificial Intelligence and Machine Learning solutions', 
 ARRAY['Natural Language Processing', 'Computer Vision', 'Predictive Analytics', 'Chatbot Development'], 
 ARRAY['Python', 'TensorFlow', 'OpenAI', 'Hugging Face'], 
 10000.00, 'AI/ML', 'Brain', 'from-purple-500 to-pink-500'),
 
('UI/UX Design', 'User-centered design for digital products', 
 ARRAY['User Research', 'Wireframing', 'Prototyping', 'Design Systems'], 
 ARRAY['Figma', 'Adobe XD', 'Sketch', 'Principle'], 
 3000.00, 'Design', 'Palette', 'from-pink-500 to-orange-500'),
 
('Cloud Solutions', 'Scalable cloud infrastructure and deployment', 
 ARRAY['Cloud Migration', 'Auto Scaling', 'Load Balancing', 'Monitoring'], 
 ARRAY['AWS', 'Google Cloud', 'Azure', 'Docker'], 
 6000.00, 'Infrastructure', 'Cloud', 'from-cyan-500 to-blue-500');

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, phone, subject, message, priority, status, starred) VALUES 
('Alice Cooper', 'alice.cooper@email.com', '+1-555-0201', 'Website Development Inquiry', 'Hi, I am interested in developing a new website for my business. Can you provide more details about your services?', 'high', 'unread', true),
('Bob Martinez', 'bob.martinez@email.com', '+1-555-0202', 'Mobile App Quote', 'We need a mobile app for our restaurant chain. What would be the estimated cost and timeline?', 'medium', 'read', false),
('Carol Davis', 'carol.davis@email.com', '+1-555-0203', 'AI Integration Question', 'Can you help us integrate AI chatbot into our existing customer service system?', 'high', 'unread', true),
('Daniel Lee', 'daniel.lee@email.com', '+1-555-0204', 'General Inquiry', 'I would like to know more about your company and the services you offer.', 'low', 'read', false),
('Emma Thompson', 'emma.thompson@email.com', '+1-555-0205', 'Partnership Opportunity', 'We are looking for a technology partner for our upcoming project. Are you interested?', 'medium', 'replied', false);
