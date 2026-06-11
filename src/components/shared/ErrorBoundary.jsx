import React from "react";
import { ErrorLogger } from "@/lib/errorLogger";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * React Error Boundary — catches render-time exceptions.
 * Displays a branded Arabic error page.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    ErrorLogger.error("React render error caught by ErrorBoundary", error, {
      component_stack: info.componentStack?.slice(0, 300),
    });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background" dir="rtl">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" aria-hidden="true" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-7xl font-black text-destructive/20 leading-none select-none" aria-hidden="true">
              500
            </h1>
            <h2 className="text-2xl font-bold text-foreground">حدث خطأ في النظام</h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
              نأسف، حدث خطأ غير متوقع. تم تسجيل المشكلة وسيعمل الفريق التقني على حلها.
            </p>
          </div>

          {/* Error detail (dev only) */}
          {import.meta.env.DEV && this.state.error && (
            <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20 text-right">
              <p className="text-xs font-mono text-destructive break-all">
                {this.state.error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={() => this.setState({ hasError: false, error: null })}
              className="gap-2 cursor-pointer min-w-40">
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/"}
              className="gap-2 cursor-pointer min-w-40">
              <Home className="w-4 h-4" />
              الصفحة الرئيسية
            </Button>
          </div>

          <p className="text-xs text-muted-foreground pt-2 border-t border-border">
            منصة مُعين الرقمية — رمز الخطأ 500
          </p>
        </div>
      </div>
    );
  }
}