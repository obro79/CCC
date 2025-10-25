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
            "cc-capture=cc_context.git_hooks.pre_commit:main",
            "cc-status=cc_context.cli.status:main",
            "cc-restore=cc_context.cli.restore:main",
            "cc-list=cc_context.cli.list_contexts:main",
        ],
    },
)
