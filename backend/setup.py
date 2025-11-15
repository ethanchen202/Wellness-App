from setuptools import setup, find_packages

setup(
    name="posture_backend",
    version="0.1.0",
    packages=find_packages(),
    entry_points={
        "console_scripts": [
            "start-backend=server:main",
        ]
    },
)
