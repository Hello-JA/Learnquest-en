import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function RegisterSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: ""
  });

  const submitRegistration = trpc.registrations.submit.useMutation({
    onSuccess: () => {
      toast.success("Registration successful! We'll be in touch soon.");
      setFormData({ name: "", email: "", role: "" });
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred. Please try again.");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please complete all fields");
      return;
    }

    submitRegistration.mutate({
      name: formData.name,
      email: formData.email,
      role: formData.role as "student" | "parent" | "teacher",
    });
  };

  return (
    <section id="register" className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Start Your Adventure</h2>
            <p className="text-lg text-blue-100">Join thousands of students who are already transforming their learning</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">What is your role?</label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent/Guardian</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitRegistration.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {submitRegistration.isPending ? "Registering..." : "Start Free"}
              </Button>

              {/* Privacy Note */}
              <p className="text-xs text-gray-600 text-center">
                By registering, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </form>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-white text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span>100% Secure</span>
            </div>
            <div className="hidden sm:block text-blue-300">•</div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              <span>No Credit Card</span>
            </div>
            <div className="hidden sm:block text-blue-300">•</div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
