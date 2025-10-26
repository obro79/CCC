from setuptools import setup, find_packages

setup(
    name="cc-context",
    version="0.1.0",
    description="Claude Code Context Manager - Git-integrated conversation history",
    packages=find_packages(),
    python_requires=">=3.8",
    install_requires=[],
    entry_points={
        "console_scripts": [
            "cc-init=cc_context.cli.init:main",
            "cc-capture=cc_context.git_hooks.post_commit:main",
            "cc-checkout-sync=cc_context.cli.checkout_sync:main",
            "cc-install-hook=cc_context.cli.install_hook:main",
            "cc-status=cc_context.cli.status:main",
            "cc-restore=cc_context.cli.restore:main",
            "cc-list=cc_context.cli.list_contexts:main",
        ],
    },
)
