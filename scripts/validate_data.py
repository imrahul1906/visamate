#!/usr/bin/env python3
"""
Lightweight data validator for visamate JSON data files.

Usage: python3 scripts/validate_data.py

Creates reports/validation-report.json and exits with code 1 on validation errors.
"""
import json
import sys
from pathlib import Path
from jsonschema import Draft7Validator, FormatChecker

ROOT = Path(__file__).resolve().parent.parent
SCHEMAS = ROOT / "schemas"
DATA = ROOT / "data"
REPORTS = ROOT / "reports"


def load_schema(name):
    path = SCHEMAS / name
    with path.open() as f:
        return json.load(f)


def validate_file(path: Path, schema, validator_cls=Draft7Validator):
    instance = json.load(path.open())
    validator = validator_cls(schema, format_checker=FormatChecker())
    errors = list(validator.iter_errors(instance))
    return errors


def main():
    REPORTS.mkdir(exist_ok=True)
    schemas = {
        "info": load_schema("info.schema.json"),
        "visa-types": load_schema("visa-types.schema.json"),
        "requirements": load_schema("requirements.schema.json"),
        "vfs_center": load_schema("vfs_center.schema.json"),
        "routing": load_schema("routing.schema.json"),
    }

    results = {"files": []}
    errors_found = False

    # validate country info and visa-types
    for country_dir in (DATA / "countries").glob("*"):
        # info.json
        info_file = country_dir / "info.json"
        if info_file.exists():
            errs = validate_file(info_file, schemas["info"])
            results["files"].append({"path": str(info_file.relative_to(ROOT)), "errors": [e.message for e in errs]})
            if errs:
                errors_found = True

        visa_types_file = country_dir / "visa-types.json"
        if visa_types_file.exists():
            errs = validate_file(visa_types_file, schemas["visa-types"])
            results["files"].append({"path": str(visa_types_file.relative_to(ROOT)), "errors": [e.message for e in errs]})
            if errs:
                errors_found = True

        routing_dir = country_dir / "routing"
        if routing_dir.exists():
            for route in routing_dir.glob("*.json"):
                errs = validate_file(route, schemas["routing"])
                results["files"].append({"path": str(route.relative_to(ROOT)), "errors": [e.message for e in errs]})
                if errs:
                    errors_found = True

    # validate requirements
    req_dir = DATA / "requirements"
    if req_dir.exists():
        for r in req_dir.glob("*.json"):
            errs = validate_file(r, schemas["requirements"])
            results["files"].append({"path": str(r.relative_to(ROOT)), "errors": [e.message for e in errs]})
            if errs:
                errors_found = True

    # validate vfs_center
    vfs_dir = DATA / "vfs_center"
    if vfs_dir.exists():
        for v in vfs_dir.glob("*.json"):
            errs = validate_file(v, schemas["vfs_center"])
            results["files"].append({"path": str(v.relative_to(ROOT)), "errors": [e.message for e in errs]})
            if errs:
                errors_found = True

    report_path = REPORTS / "validation-report.json"
    report_path.write_text(json.dumps(results, indent=2))

    # print summary
    total = len(results["files"])
    failing = sum(1 for f in results["files"] if f["errors"])
    print(f"Validated {total} files, {failing} failed.")
    if failing:
        print("Failures details written to:", report_path)
        for f in results["files"]:
            if f["errors"]:
                print(f"- {f['path']}")
                for e in f["errors"]:
                    print(f"  - {e}")
        sys.exit(1)
    else:
        print("All files validated successfully.")
        sys.exit(0)


if __name__ == "__main__":
    main()
