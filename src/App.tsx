import React, { useState, useEffect } from "react";
import { PageView, BlogPost, Theme, AuthUser } from "./types";
import { FEATURED_ARTICLES } from "./data/initialData";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WaitlistModal } from "./components/WaitlistModal";
import { ArticleModal } from "./components/ArticleModal";

import { HomePage } from "./pages/HomePage";
import { WhyPage } from "./pages/WhyPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { DevelopersPage } from "./pages/DevelopersPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { BlogPage } from "./pages/BlogPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";
import { IntegrationGuidePage } from "./pages/IntegrationGuidePage";
import { DashboardPage } from "./pages/DashboardPage";
import { UserDashboardPage } from "./pages/UserDashboardPage";
import { TerminalAuthorizePage } from "./pages/TerminalAuthorizePage";
import { AccountPages } from "./pages/AccountPages";
import { getCurrentUser, logoutUser, trackAnalyticsEvent } from "./lib/api";

export default function App() {
  const paymentReturn = new URLSearchParams(window.location.search).has("payment");
  const initialPage =
    window.location.pathname === "/terminal/authorize"
      ? "terminal-authorize"
      : paymentReturn
        ? "settings"
        : "home";
  const [currentPage, setCurrentPage] = useState<PageView>(initialPage);
  const [theme, setTheme] = useState<Theme>(() =>
    window.localStorage.getItem("wfi_theme") === "dark" ? "dark" : "light",
  );
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [waitlistSource, setWaitlistSource] = useState("modal");
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const pendingTerminalCode =
    new URLSearchParams(window.location.search).get("code") ||
    window.sessionStorage.getItem("wfi_pending_terminal_code") ||
    "";

  const isLight = theme === "light";

  useEffect(() => {
    window.localStorage.setItem("wfi_theme", theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Track page view event
  useEffect(() => {
    trackAnalyticsEvent("page_view", currentPage).catch(() => {});
  }, [currentPage]);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setCurrentUser(user);
        if (
          user &&
          initialPage === "home" &&
          window.location.pathname === "/"
        ) {
          setCurrentPage("profile");
        }
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const handleOpenWaitlist = (source: string = "header") => {
    setWaitlistSource(source);
    setWaitlistModalOpen(true);

    // Track CTA click event
    trackAnalyticsEvent("cta_click", currentPage, { source }).catch(() => {});
  };

  const handleOpenArticle = (art?: BlogPost) => {
    setActiveArticle(art || FEATURED_ARTICLES[0]);
    trackAnalyticsEvent("blog_read", currentPage).catch(() => {});
  };

  const handleLogout = async () => {
    await logoutUser().catch(() => {});
    setCurrentUser(null);
    setCurrentPage("home");
  };

  return (
    <div
      className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-300 ${
        isLight
          ? "bg-[#FAF8F3]/95 text-[#2C2825] selection:bg-[#8C5E3C] selection:text-white"
          : "bg-[#131513] text-[#F5F2EA] selection:bg-[#6B7A3D] selection:text-white"
      }`}
    >
      {/* Sticky Top Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenWaitlist={() => handleOpenWaitlist("header_btn")}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        currentUser={currentUser}
        authLoading={authLoading}
        onLogout={handleLogout}
      />

      {/* Main Active Page View */}
      <main className="flex-grow">
        {currentPage === "home" && (
          <HomePage
            setCurrentPage={setCurrentPage}
            onOpenWaitlist={() => handleOpenWaitlist("home_hero")}
            onOpenArticle={() => handleOpenArticle()}
            theme={theme}
          />
        )}

        {currentPage === "why-waitforit" && (
          <WhyPage
            setCurrentPage={setCurrentPage}
            onOpenWaitlist={() => handleOpenWaitlist("why_hero")}
            theme={theme}
          />
        )}

        {currentPage === "how-it-works" && (
          <HowItWorksPage
            setCurrentPage={setCurrentPage}
            onOpenWaitlist={() => handleOpenWaitlist("how_hero")}
            theme={theme}
          />
        )}

        {currentPage === "features" && (
          <FeaturesPage
            setCurrentPage={setCurrentPage}
            onOpenWaitlist={() => handleOpenWaitlist("features_hero")}
            theme={theme}
          />
        )}

        {currentPage === "developers" && (
          <DevelopersPage
            setCurrentPage={setCurrentPage}
            onOpenWaitlist={() => handleOpenWaitlist("developers_hero")}
            theme={theme}
          />
        )}

        {currentPage === "roadmap" && (
          <RoadmapPage
            setCurrentPage={setCurrentPage}
            onOpenWaitlist={() => handleOpenWaitlist("roadmap_hero")}
            theme={theme}
          />
        )}

        {currentPage === "blog" && (
          <BlogPage
            setCurrentPage={setCurrentPage}
            onOpenArticle={handleOpenArticle}
            theme={theme}
          />
        )}

        {currentPage === "about" && (
          <AboutPage
            setCurrentPage={setCurrentPage}
            onOpenWaitlist={() => handleOpenWaitlist("about_hero")}
            theme={theme}
          />
        )}

        {currentPage === "contact" && (
          <ContactPage setCurrentPage={setCurrentPage} theme={theme} />
        )}

        {currentPage === "login" && (
          <LoginPage
            setCurrentPage={setCurrentPage}
            theme={theme}
            currentUser={currentUser}
            onAuthenticated={setCurrentUser}
          />
        )}

        {currentPage === "integration-guide" && (
          <IntegrationGuidePage
            setCurrentPage={setCurrentPage}
            onOpenWaitlist={() => handleOpenWaitlist("guide_hero")}
            theme={theme}
          />
        )}

        {currentPage === "terminal-authorize" && (
          <TerminalAuthorizePage
            code={pendingTerminalCode}
            currentUser={currentUser}
            setCurrentPage={setCurrentPage}
            theme={theme}
          />
        )}

        {currentPage === "dashboard" && currentUser?.role === "admin" && (
          <DashboardPage theme={theme} />
        )}

        {currentPage === "dashboard" &&
          currentUser &&
          currentUser.role !== "admin" && (
            <UserDashboardPage currentUser={currentUser} theme={theme} />
          )}

        {currentPage === "dashboard" && !currentUser && (
          <LoginPage
            setCurrentPage={setCurrentPage}
            theme={theme}
            currentUser={currentUser}
            onAuthenticated={setCurrentUser}
            adminRequired
          />
        )}

        {[
          "profile",
          "capsules",
          "logs",
          "articles",
          "capsule-detail",
          "log-detail",
          "article-detail",
          "settings",
        ].includes(currentPage) &&
          currentUser &&
          (
            <AccountPages
              page={currentPage}
              currentUser={currentUser}
              theme={theme}
              setCurrentPage={setCurrentPage}
              selectedRecordId={selectedRecordId}
              setSelectedRecordId={setSelectedRecordId}
            />
          )}

        {[
          "profile",
          "capsules",
          "logs",
          "articles",
          "capsule-detail",
          "log-detail",
          "article-detail",
          "settings",
        ].includes(currentPage) &&
          !currentUser && (
            <LoginPage
              setCurrentPage={setCurrentPage}
              theme={theme}
              currentUser={currentUser}
              onAuthenticated={setCurrentUser}
            />
          )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentPage={setCurrentPage}
        onOpenWaitlist={() => handleOpenWaitlist("footer_link")}
        theme={theme}
      />

      {/* Global Waitlist Popup Modal */}
      <WaitlistModal
        isOpen={waitlistModalOpen}
        onClose={() => setWaitlistModalOpen(false)}
        source={waitlistSource}
        theme={theme}
      />

      {/* Global Article Reading Modal */}
      <ArticleModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
        onJoinWaitlist={() => handleOpenWaitlist("article_modal")}
        theme={theme}
      />
    </div>
  );
}
