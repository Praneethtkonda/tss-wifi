def parse_approval_data(data_arr):
    final = []
    for data in data_arr:
        data_id, name, phone, ts, status = data
        final.append({
            "id": str(data_id),
            "name": name,
            "phone": phone,
            "ts": ts.isoformat(),
            "status": status
        })
    return final