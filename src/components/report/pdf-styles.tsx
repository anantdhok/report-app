import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    paddingTop: 40,
    paddingBottom: 60,
    fontSize: 12
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderBottom: "1px solid #eee",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  footer: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    color: "#888",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "left",
    fontWeight: "bold"
  },
  text: {
    fontSize: 10,
    marginBottom: 7
  },
  comment: {
    fontSize: 12,
    marginBottom: 4,
    color: "#444",
    paddingLeft: 8,
    borderLeft: "2px solid #eee"
  },
  keyword: {
    fontSize: 12,
    marginRight: 8,
    padding: 2,
    borderRadius: 4,
    backgroundColor: "#f5f5f5"
  },
  locator: {
    fontSize: 12,
    marginRight: 8,
    padding: 2,
    borderRadius: 4,
    backgroundColor: "#e0f7fa"
  }
});
